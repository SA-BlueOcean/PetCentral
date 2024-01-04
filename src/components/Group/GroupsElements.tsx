import { api } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";

export default function GroupsElements() {
  const groupsList = api.groups.findAllGroups.useQuery();

  return (
    <>
      <ul className="w-full divide-y overflow-scroll">
        {groupsList.data?.groups.map((group) => (
          <li key={group.id} className="py-3">
            <Link
              href={`/group/${group.id}`}
              className="flex items-center gap-3 pl-px"
            >
              <Image
                src={`${group.photoUrl}`}
                alt={`Image for ${group.name}`}
                width={50}
                height={50}
                unoptimized={true}
                className="relative h-10 w-10 rounded-lg bg-secondary ring-1 ring-base-200"
              />
              {group.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
