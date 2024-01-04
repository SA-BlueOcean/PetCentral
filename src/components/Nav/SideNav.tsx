import Link from "next/link";
import SideNavElements from "./SideNavElements";
import Image from "next/image";
import { Rubik_Bubbles } from "next/font/google";

const rubik = Rubik_Bubbles({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
});

export default function SideNav() {
  return (
    <nav className="flex flex-col items-center justify-center gap-2 rounded-lg bg-primary-content p-4 text-neutral">
      <Link
        href={"/"}
        className="flex flex-col items-center justify-center gap-2"
      >
        <div className="rounded-full border-4 border-accent bg-base-100 p-4 shadow-2xl">
          <Image
            src={"/logo-100.png"}
            alt={"Pet Pals Logo"}
            width={75}
            height={75}
          />
        </div>
        <h2 className={`text-3xl tracking-wide ${rubik.className}`}>
          Pet Pals
        </h2>
      </Link>
      <SideNavElements />
    </nav>
  );
}
