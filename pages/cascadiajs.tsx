import Image from "next/image";

import OptInForm from "components/OptInForm";

import Mux from "components/Navbar/Mux";
import cascadiaLogo from "public/images/cjs-guestbook-logo.png";

const CascadiaOptIn = () => (
  <>
    <div className="p-4 w-full max-w-sm mx-auto grid grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 items-center">
      <Mux />
      <span>&hearts;</span>
      <Image src={cascadiaLogo} alt="CascadiaJs: Family Reunion" />
    </div>
    <OptInForm className="p-4 sm:p-8 w-full max-w-screen-lg mx-auto" />
  </>
);

export default CascadiaOptIn;
