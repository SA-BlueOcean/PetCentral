import Link from "next/link";
import GroupsElements from "./GroupsElements";



export default function SideNavGroups() {
  return (
    <nav className="flex flex-col items-center justify-center gap-2 rounded-lg bg-primary-content p-4 text-neutral">
      <Link
        href={"/group"}
        className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-2xl">Groups</h2>
      </Link>
      <GroupsElements />
    </nav>
  );
}