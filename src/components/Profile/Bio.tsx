import { api } from "@/utils/api";
export default function Bio({ profileId }: { profileId: string }) {
  const user = api.profile.get.useQuery(
    { profileId },
    { enabled: !!profileId },
  );

  return (
    <div className="px-3 pt-10">
      {user.data?.bio ? <h2 className="text-xl font-bold">About Me:</h2> : ""}
      <p className="pt-2">{user.data?.bio}</p>
    </div>
  );
}
