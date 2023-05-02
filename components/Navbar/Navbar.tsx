import SelectDevice from "./SettingsDialog";
import Mux from "./Mux";
import event from "constants/event";

type Props = {
  withSettings?: boolean;
  subheading: string;
};
const Navbar = ({ withSettings = true, subheading = "" }: Props) => (
  <div className="p-4 sm:p-8 relative text-center">
    <h1>
      <a
        href={`https://www.mux.com?utm_source=mux-guestbook&utm_medium=conference&utm_campaign=${event.utmCampaign}`}
      >
        <Mux className="inline-block h-7 sm:h-10 w-auto mb-3" />
      </a>
      <div className="text-xl">{subheading}</div>
    </h1>
    {withSettings && (
      <SelectDevice className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2" />
    )}
  </div>
);

export default Navbar;
