import { useGlobalContext } from "@/providers/GlobalContext";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { FileSearch, LogIn, UserRoundSearch } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Avatar from "../Feed/Avatar";

const links = [
  {
    name: "My Profile",
    href: "/profile",
  },
  {
    name: "Find Friends",
    href: "/friends",
    icon: <UserRoundSearch />,
  },
  {
    name: "Find Groups",
    href: "/group",
    icon: <FileSearch />,
  },
];

export default function SideNav() {
  const session = useSession();
  const { setDisplayLoginModal } = useGlobalContext();
  const profile = api.profile.get.useQuery(
    session.data?.user.id ? { profileId: session.data.user.id } : undefined,
    { enabled: !!session.data?.user.id },
  );
  return (
    <nav className="flex flex-col items-center justify-center gap-2 rounded-lg bg-primary-content p-4 text-neutral">
      <Link
        href={"/"}
        className="flex flex-col items-center justify-center gap-2"
      >
        <div className="h-14 w-14 rounded-full bg-base-100"></div>
        <h2 className="text-2xl">Pet Pals</h2>
      </Link>
      <ul className="w-full divide-y">
        {links.map((link) => (
          <li key={link.name} className="py-3">
            <Link href={link.name === "My Profile" ? `/profile/${profile.data?.id}` : link.href} className="flex items-center gap-2">
              {link.name === "My Profile" ? (
                <>
                  {session.status === "unauthenticated" ? (
                    <>
                      <LogIn />
                      <button className="">Sign in</button>
                    </>
                  ) : (
                    <>
                      <div
                        className={cn(
                          "bg-base-400 relative h-6 w-6 overflow-clip rounded-full",
                          profile.isLoading && "skeleton",
                        )}
                      >
                        {profile.isFetched && (
                          <Avatar
                            profilePhotoUrl={profile.data?.profilePhotoUrl}
                          />
                        )}
                      </div>
                      {session.status === "authenticated" ? <>{link.name}</> : ""}
                    </>
                  )}
                </>
              ) : (
                <>
                  {link.icon}
                  {link.name}
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex w-full flex-col gap-2">
        <button
          className={cn(
            session.status === "loading" ? "" : "",
            "btn mt-2 h-8 min-h-8 w-full rounded-full",
          )}
          onClick={() => {
            if (session.status === "authenticated") {
              void signOut();
            } else {
              setDisplayLoginModal(true);
            }
          }}
        >
          {session.status === "authenticated"
            ? "Sign out"
            : session.status === "unauthenticated"
              ? "Sign in"
              : ""}
        </button>
        <button className="btn mt-2 h-8 min-h-8 w-full rounded-full">
          New Post
        </button>
      </div>
    </nav>
  );
}
