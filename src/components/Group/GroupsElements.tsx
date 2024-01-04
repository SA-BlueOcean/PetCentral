import { api } from "@/utils/api";
import Link from "next/link";


export default function GroupsElements() {
  const groupsList = api.groups.findAllGroups.useQuery();

  return (
    <>
      <ul className="w-full divide-y">
        {groupsList.data?.groups.map((group) => (
          <li key={group.id} className="py-3">
            <Link href={`/${group.id}`} className="flex items-center gap-2">{group.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
