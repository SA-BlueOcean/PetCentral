import Link from "next/link";
import GroupsElements from "./GroupsElements";

export default function SideNavGroups() {
  return (
    <nav className="relative flex max-h-[50vh] flex-col items-center justify-center gap-2 rounded-lg bg-primary-content px-4 text-neutral">
      <div className="sticky top-0 z-50 w-full bg-primary-content pt-4">
        <Link
          href={"/group"}
          className="flex flex-col items-center justify-center gap-2"
        >
          <h2 className="text-2xl">Groups</h2>
        </Link>
      </div>
      <GroupsElements />
    </nav>
  );
}
