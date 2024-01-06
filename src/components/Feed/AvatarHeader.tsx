import { cn } from "@/utils/cn";
import Link from "next/link";
import Avatar from "./Avatar";

type AvatarHeaderProps = {
  id: string;
  createdAt?: Date;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  profilePhotoUrl?: string | null;
  mode?: "POST" | "COMMENT";
};

export default function AvatarHeader({
  id,
  firstName,
  lastName,
  name,
  profilePhotoUrl,
  createdAt,
  mode,
}: AvatarHeaderProps) {
  return (
    <>
      <Link href={`/profile/${id}`}>
        <div
          className={cn(
            mode === "COMMENT" ? "h-6 w-6" : "h-10 w-10",
            "relative overflow-clip rounded-full bg-secondary ring-1 ring-base-200",
          )}
        >
          <Avatar profilePhotoUrl={profilePhotoUrl} />
        </div>
      </Link>

      <div
        className={cn(
          "flex",
          mode === "COMMENT" ? "items-baseline gap-2" : "flex-col",
        )}
      >
        <Link href={`/profile/${id}`} className="font-semibold hover:underline">
          {firstName
            ? `${firstName}${lastName ? ` ${lastName}` : ""}`
            : `${name ?? "?"}`}
        </Link>
        {createdAt && (
          <span className="text-base-700 text-xs">
            {createdAt.toLocaleString()}
          </span>
        )}
      </div>
    </>
  );
}
