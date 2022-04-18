import * as React from "react";
import SelectDevice from "./SettingsDialog";
import Mux from "./Mux";

const Navbar = () => (
  <div className="p-4 sm:p-8 relative text-center">
    <h1>
      <a href="https://mux.com">
        <Mux className="inline-block h-7 sm:h-10 w-auto mb-2" />
      </a>
      <div className="text-xl">Sign our Guestbook!</div>
    </h1>
    <SelectDevice className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2" />
  </div>
);

export default Navbar;
