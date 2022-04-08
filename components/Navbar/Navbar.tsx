import * as React from "react";
import SelectDevice from "./SettingsModal";

const Navbar = () => (
  <div className="py-4 text-center relative">
    <h1 className="text-5xl font-header neon-pink-600 mb-2">
      Mux @ React Miami
    </h1>
    <p className="text-xl text-white">Sign the video guestbook</p>
    <SelectDevice className="absolute right-4 top-1/2 -translate-y-1/2" />
  </div>
);

export default Navbar;
