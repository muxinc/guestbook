import * as React from "react";
import SelectDevice from "./SettingsDialog";
import Mux from "./Mux";

type Props = {
  withSettings?: boolean;
  subheading: string;
};
const Navbar = ({ withSettings = true, subheading = "" }: Props) => (
  <div className="p-4 sm:p-8 relative text-center">
    <h1>
      <a href="https://mux.com?utm_source=mux-guestbook&utm_medium=conference&utm_campaign=cascadiajs">
        <Mux className="inline-block h-7 sm:h-10 w-auto mb-2" />
      </a>
      <div className="text-xl">{subheading}</div>
    </h1>
    {withSettings && (
      <SelectDevice className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2" />
    )}
  </div>
);

export default Navbar;
