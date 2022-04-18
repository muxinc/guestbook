import * as React from "react";
import SelectDevice from "./SettingsDialog";
import Mux from "./Mux";

const Navbar = () => (
  <div className="py-4 sm:py-8 pr-12 sm:pr-4 sm:text-center relative">
    <h1 className="text-3xl sm:text-5xl md:text-6xl neon-pink-600 flex items-center justify-center">
      <Mux className="inline-block h-5 sm:h-10 w-auto mr-3" />
      <span className="font-header overflow-visible">@ React Miami</span>
    </h1>
    <SelectDevice className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2" />
  </div>
);

export default Navbar;
