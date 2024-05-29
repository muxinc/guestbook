import Image from "next/image";

import OptInForm from "components/OptInForm";

import Mux from "components/Navbar/Mux";
import cascadiaLogo from "public/images/cjs-guestbook-logo.png";

const CascadiaOptIn = () => (
  <>
    <div className="px-8 py-4 w-full max-w-sm mx-auto grid grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 items-center">
      <a href="https://www.mux.com/">
        <Mux />
      </a>
      <span>&hearts;</span>
      <a href="https://cascadiajs.com/2024">
        <Image
          src={cascadiaLogo}
          priority
          layout="responsive"
          sizes="288px"
          alt="CascadiaJs: Family Reunion"
        />
      </a>
    </div>
    <OptInForm className="p-4 sm:p-8 w-full max-w-screen-lg mx-auto" />
  </>
);

export default CascadiaOptIn;
