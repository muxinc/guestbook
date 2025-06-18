import { type SharedData } from '@/types';
import { Head, Link, usePage, Deferred } from '@inertiajs/react';

import Grid from '@/components/guestbook/grid';
import Navbar from '@/components/guestbook/nav-bar';
import Recorder from '@/components/guestbook/recorder/recorder';
import VideoStore from '@/contexts/video-store';
import Store from '@/contexts/global-store';

export default function Welcome() {
    const { entries } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Store>
                <main className="h-[100vh] h-[100svh] flex flex-col">
                    <Navbar subheading={`Leave a 3 second video in the Guestbook!`} />
                    <VideoStore initialVideos={[]}>
                        <Recorder />
                    </VideoStore>
                    {/* <Confetti /> */}

                    {entries.length > 0 ? (
                        <Grid entries={entries} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            No entries yet. Be the first to record a message!
                        </div>
                    )}
                </main>
            </Store>
        </>
    );
}
