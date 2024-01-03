import Link from "next/link";
import SideNavElements from "./SideNavElements";


export default function SideNav() {
  return (
    <nav className="flex flex-col items-center justify-center gap-2 rounded-lg bg-primary-content p-4 text-neutral">
      <Link
        href={"/"}
        className="flex flex-col items-center justify-center gap-2"
      >
        <div className="h-14 w-14 rounded-full bg-base-100"></div>
        <h2 className="text-2xl">Pet Pals</h2>
      </Link>
      <SideNavElements />
    </nav>
  );
}
