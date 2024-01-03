import Link from "next/link";
import Search from "./Search";
import { BookUser, UsersRound } from "lucide-react";

export default function TopNav() {
  return (
    <nav className="flex h-full w-full items-center justify-between bg-primary-content p-2 px-4 text-neutral shadow">
      <ul className="hidden flex-row gap-4 sm:flex">
        <li>
          <Link href={"/friends"} className="flex items-center gap-2">
            <UsersRound />
            My Friends
          </Link>
        </li>
        <li>
          <Link href={"/group/mygroups"} className="flex items-center gap-2">
            <BookUser /> My Groups
          </Link>
        </li>
      </ul>
      <div className="flex-none sm:hidden">
        <label
          htmlFor="primary-drawer"
          aria-label="open sidebar"
          className="btn btn-square btn-ghost"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-6 w-6 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>
      <div className="hidden sm:block">
        <Search />
      </div>
      <div className="block pr-4 sm:hidden">
        <h2 className="text-xl">Pet Pals</h2>
      </div>
    </nav>
  );
}
