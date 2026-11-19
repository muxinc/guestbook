import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the component's media lifecycle with mocked browser APIs, without
// requiring camera hardware or adding a browser-test dependency.
function load(path, modules, globals = {}) {
    const source = ts.transpileModule(
        readFileSync(new URL(`../../resources/js/${path}`, import.meta.url), 'utf8'),
        { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React } },
    ).outputText;
    const exports = {};
    vm.runInNewContext(source, {
        exports,
        require: (name) => modules[name] ?? {},
        console: { log() {}, error() {} },
        ...globals,
    });
    return exports.default;
}

function hookHarness() {
    const hooks = [];
    let cursor = 0;
    let pending = [];
    const React = {
        createElement: (type, props, ...children) => ({ type, props, children }),
        createContext: () => ({ Provider: 'Provider' }),
        useContext: (context) => context,
        useCallback: (callback) => callback,
        useRef(initial) {
            const index = cursor++;
            return hooks[index] ??= { current: initial };
        },
        useState(initial) {
            const index = cursor++;
            hooks[index] ??= { value: initial };
            return [hooks[index].value, (value) => {
                hooks[index].value = typeof value === 'function' ? value(hooks[index].value) : value;
            }];
        },
        useEffect(effect, deps) {
            const index = cursor++;
            const previous = hooks[index];
            if (!previous || deps.some((dep, i) => !Object.is(dep, previous.deps[i]))) {
                pending.push(() => {
                    previous?.cleanup?.();
                    hooks[index] = { deps, cleanup: effect() };
                });
            }
        },
    };
    return {
        React, hooks,
        render(component) {
            cursor = 0;
            const tree = component({ children: null });
            const effects = pending;
            pending = [];
            effects.forEach((effect) => effect());
            return tree;
        },
        unmount: () => hooks.forEach((hook) => hook.cleanup?.()),
    };
}

function stream(videoId, audioId = 'mic') {
    const tracks = [videoId, audioId].map((deviceId) => ({
        stopped: false,
        stop() { this.stopped = true; },
        getSettings: () => ({ deviceId }),
    }));
    return {
        getTracks: () => tracks,
        getVideoTracks: () => [tracks[0]],
        getAudioTracks: () => [tracks[1]],
    };
}

const RecordingStatus = {
    INITIALIZING: 'initializing', READY: 'ready', RECORDING: 'recording', STOPPING: 'stopping',
};
const MessageType = { RECORDER: 'recorder', ERROR: 'error' };

function mount(getUserMedia, initialStatus = 'ready', supportsMimeType = true) {
    const harness = hookHarness();
    const messages = [];
    const devices = { videoDeviceId: 'built-in', audioDeviceId: 'mic' };
    const recorders = [];
    const recorder = {
        recordingStatus: initialStatus,
        setRecordingStatus(status) { this.recordingStatus = status; },
    };
    // Keep the setter independent of its receiver, as React setters are.
    recorder.setRecordingStatus = (status) => { recorder.recordingStatus = status; };
    const Component = load('components/guestbook/recorder/recorder.tsx', {
        react: harness.React,
        '@/constants/media-recorder': { MIME_TYPE_STACK: ['video/webm'] },
        '@/contexts/device-id-context': { useDeviceIdContext: () => devices },
        '@/contexts/video-context': { useVideoContext: () => ({ submitUpload() {} }) },
        '@/contexts/console-context': {
            MessageType,
            useConsoleContext: () => ({ setMessage: (message) => messages.push(message) }),
        },
        '@/contexts/recorder-context': {
            RecordingStatus, useRecorderContext: () => recorder,
        },
    }, {
        navigator: { mediaDevices: { getUserMedia } },
        MediaRecorder: class {
            static isTypeSupported() { return supportsMimeType; }
            constructor(mediaStream) { this.stream = mediaStream; recorders.push(this); }
            start() { this.started = true; }
            stop() { this.stopped = true; }
        },
    });
    // Simulate React attaching the video DOM node before running effects.
    harness.hooks[0] = { current: { srcObject: null } };
    const render = () => harness.render(Component);
    render();
    return {
        devices, messages, recorder, recorders, render,
        video: harness.hooks[0].current,
        unmount: harness.unmount,
    };
}

const flush = () => new Promise((resolve) => setImmediate(resolve));

function findElement(tree, predicate) {
    if (!tree || typeof tree !== 'object') return;
    if (predicate(tree)) return tree;
    for (const child of tree.children ?? []) {
        const found = findElement(child, predicate);
        if (found) return found;
    }
}

test('switching requires the selected camera and microphone and releases the old stream first', async () => {
    const requests = [];
    const streams = [];
    const app = mount(async (constraints) => {
        if (streams.length) assert.ok(streams.at(-1).getTracks().every((track) => track.stopped));
        requests.push(constraints);
        const next = stream(constraints.video.deviceId.exact, constraints.audio.deviceId.exact);
        streams.push(next);
        return next;
    });
    await flush();
    app.devices.videoDeviceId = 'elgato';
    app.render();
    await flush();
    assert.equal(requests[1].video.deviceId.exact, 'elgato');
    assert.equal(requests[1].audio.deviceId.exact, 'mic');
    assert.equal(app.video.srcObject, streams[1]);
    app.devices.audioDeviceId = 'usb-mic';
    app.render();
    await flush();
    assert.equal(requests[2].audio.deviceId.exact, 'usb-mic');
    assert.equal(app.recorders.at(-1).stream, streams[2]);
    app.unmount();
    assert.ok(streams[2].getTracks().every((track) => track.stopped));
});

test('rapid switches release stale acquisitions before opening the latest camera', async () => {
    const requests = [];
    let acquisitionPending = false;
    const stale = stream('built-in');
    const app = mount(() => {
        assert.equal(acquisitionPending, false, 'exclusive hardware cannot acquire twice concurrently');
        if (requests.length) assert.ok(stale.getTracks().every((track) => track.stopped));
        acquisitionPending = true;
        return new Promise((resolve) => requests.push((value) => {
            acquisitionPending = false;
            resolve(value);
        }));
    });
    await flush();
    app.devices.videoDeviceId = 'intermediate';
    app.render();
    app.devices.videoDeviceId = 'elgato';
    app.render();
    assert.equal(requests.length, 1);
    requests[0](stale);
    await flush();
    assert.equal(app.video.srcObject, null);
    assert.ok(stale.getTracks().every((track) => track.stopped));
    assert.equal(requests.length, 2, 'superseded intermediate selections are skipped');
    const latest = stream('elgato');
    requests[1](latest);
    await flush();
    assert.equal(app.video.srcObject, latest);
    app.unmount();
});

test('a request resolving after unmount releases its tracks', async () => {
    let resolve;
    const app = mount(() => new Promise((done) => { resolve = done; }));
    await flush();
    app.unmount();
    const late = stream('built-in');
    resolve(late);
    await flush();
    assert.ok(late.getTracks().every((track) => track.stopped));
});

test('device errors are visible and the same source can be retried', async () => {
    let fail = true;
    const next = stream('built-in');
    const app = mount(async () => {
        if (fail) throw new Error('Camera busy');
        return next;
    });
    await flush();
    assert.ok(app.messages.some((message) => message.type === 'error'));
    assert.equal(app.video.srcObject, null);
    const tree = app.render();
    assert.ok(findElement(tree, (node) => node.props?.role === 'alert'));
    const retry = findElement(tree, (node) => node.type === 'button' && node.children.includes('Try again'));
    fail = false;
    retry.props.onClick();
    app.render();
    await flush();
    assert.equal(app.video.srcObject, next);
    assert.equal(findElement(app.render(), (node) => node.props?.role === 'alert'), undefined);
    app.unmount();
});

test('initial setup becoming ready does not stop or reopen the configured stream', async () => {
    let calls = 0;
    const next = stream('built-in');
    const app = mount(async () => { calls++; return next; }, 'initializing');
    await flush();
    app.render();
    assert.equal(app.recorder.recordingStatus, 'ready');
    assert.equal(calls, 1);
    assert.ok(next.getTracks().every((track) => !track.stopped));
    app.recorder.recordingStatus = 'recording';
    app.render();
    assert.ok(app.recorders[0].started);
    assert.ok(next.getTracks().every((track) => !track.stopped));
    app.recorder.recordingStatus = 'stopping';
    app.render();
    assert.ok(app.recorders[0].stopped);
    app.unmount();
});

test('device changes are deferred while recording', async () => {
    let calls = 0;
    const next = stream('built-in');
    const app = mount(async () => { calls++; return next; });
    await flush();
    app.recorder.recordingStatus = 'recording';
    app.render();
    app.devices.videoDeviceId = 'elgato';
    app.render();
    assert.equal(calls, 1);
    assert.ok(next.getTracks().every((track) => !track.stopped));
    app.unmount();
});

test('recorder setup errors also release newly acquired tracks', async () => {
    const next = stream('built-in');
    const app = mount(async () => next, 'ready', false);
    await flush();
    assert.ok(next.getTracks().every((track) => track.stopped));
    assert.ok(app.messages.some((message) => message.type === 'error'));
    app.unmount();
});

for (const enumerationFails of [false, true]) {
    test(`device discovery releases its permission stream when enumeration ${enumerationFails ? 'fails' : 'succeeds'}`, async () => {
        const harness = hookHarness();
        const permissionStream = stream('built-in');
        const Provider = load('contexts/device-id-context.tsx', {
            react: harness.React,
            './console-context': { MessageType, useConsoleContext: () => ({ setMessage() {} }) },
        }, {
            React: harness.React,
            window: {},
            localStorage: { getItem: () => null, setItem() {} },
            navigator: { mediaDevices: {
                getUserMedia: async () => permissionStream,
                enumerateDevices: async () => {
                    if (enumerationFails) throw new Error('Enumeration failed');
                    return [
                        { kind: 'videoinput', deviceId: 'built-in', label: 'Front camera' },
                        { kind: 'audioinput', deviceId: 'mic', label: 'Microphone' },
                    ];
                },
            } },
        });
        await harness.render(Provider).props.value.requestUserMedia();
        assert.ok(permissionStream.getTracks().every((track) => track.stopped));
        harness.unmount();
    });
}
