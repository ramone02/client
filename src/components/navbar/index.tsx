import Image from "next/image";
import "./navbar.css";

export const Navbar = () => {
  return (
    <div className="navbar">
      <Image src="/iso-logo.svg" alt="Logo" width={44} height={43} />
      <i className="pi pi-cog" />
    </div>
  );
};
