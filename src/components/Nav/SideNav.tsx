import Link from "next/link";

const links = [
  {
    name: "My Profile",
    href: "/profile",
  },
  {
    name: "Find Friends",
    href: "/friends",
  },
  {
    name: "Find Groups",
    href: "/group",
  },
];

export default function SideNav() {
  return (
    <nav className="flex flex-col items-center justify-center rounded-lg bg-primary-content p-4 text-neutral gap-2">
      <Link href={'/'} className="flex flex-col items-center justify-center gap-2">
        <div className="h-14 w-14 rounded-full bg-base-100"></div>
        <h2 className="text-2xl">Pet Pals</h2>
      </Link>
      <ul className="divide-y w-full">
        {links.map((link) => (
          <li key={link.name} className="py-2 ">
            <Link href={link.href} className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-base-100"></div>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      <button className="btn rounded-full w-full min-h-8 h-8 mt-2">New Post</button>
    </nav>
  );
}
