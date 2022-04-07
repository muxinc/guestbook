import * as React from "react";

const SelectDevice = ({ setVideoDeviceId }) => {
  const [devices, set] = React.useState([]);

  React.useEffect(() => {
    const detect = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      set(devices);
    };

    detect();
  }, []);

  return (
    <div>
      <select
        className="border p-2 w-full mb-2"
        onChange={(e) => {
          console.log(e.target.value);
        }}
      >
        {devices
          .filter((d) => d.kind === "audioinput")
          .map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label}
            </option>
          ))}
      </select>

      <hr />

      <select
        className="border p-2 w-full mb-2"
        onChange={(e) => {
          setVideoDeviceId(e.target.value);
        }}
      >
        {devices
          .filter((d) => d.kind === "videoinput")
          .map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label}
            </option>
          ))}
      </select>
    </div>
  );
};

export default SelectDevice;
