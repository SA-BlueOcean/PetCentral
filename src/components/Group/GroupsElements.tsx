import { api } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";


export default function GroupsElements() {
  const groupsList = api.groups.findAllGroups.useQuery();

  return (
    <>
      <ul className="w-full divide-y">
        {groupsList.data?.groups.map((group) => (
          <li key={group.id} className="py-3">
            <Link
              href={`/${group.id}`}
              className="flex flex-none items-center gap-3 ">
                <Image src={`${group.photoUrl}`}
                alt={`Image for ${group.name}`}
                width={50}
                height={50}
                unoptimized={true}
                style={{ objectFit: "cover" }}
                className=" flex-none h-10 w-10 rounded-lg bg-secondary ring-1 ring-base-200"/>
                {group.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
