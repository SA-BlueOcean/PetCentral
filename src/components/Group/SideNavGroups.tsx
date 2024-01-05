import Link from "next/link";
import GroupsElements from "./GroupsElements";

export default function SideNavGroups() {
  return (
    <nav className="relative rounded-lg bg-primary-content text-neutral">
      <Link
        href={"/group"}
        className="flex w-full items-center justify-center p-4"
      >
        <h2 className="text-2xl link-hover">Groups</h2>
      </Link>
      <div className="relative max-h-[40vh] overflow-y-auto">
        <GroupsElements />
      </div>
    </nav>
  );
}
