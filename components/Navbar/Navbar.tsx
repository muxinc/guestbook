import * as React from "react";
import SelectDevice from "./SettingsModal";

const Navbar = () => (
  <div className="p-4 sm:text-center relative">
    <h1 className="text-4xl sm:text-5xl font-header neon-pink-600 mb-2">
      Mux @ React Miami
    </h1>
    <p className="text-lg sm:text-xl text-white">Sign the video guestbook</p>
    <SelectDevice className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2" />
  </div>
);

export default Navbar;
