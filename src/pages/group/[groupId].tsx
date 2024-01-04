import { useState, useEffect } from "react";
import Head from "next/head";
import Feed from "@/components/Feed";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { GroupHeader } from "@/components/Group/GroupHeader";

type Group = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string | null;
  photoUrl: string | null;
  bannerPhotoUrl: string | null;
};

export default function GroupPage() {
  const router = useRouter();
  const groupId = router.query.groupId! as string;
  const [groupData, setGroupData] = useState<Group | null>(null);

  // Fetch Group Details
  api.groups.fetchDetails.useQuery(
    {
      groupID: groupId,
    },
    {
      onSuccess(data) {
        setGroupData(data.group);
      },
    },
  );

  // Fetch Group Members
  const membersQuery = api.groups.fetchMemberCount.useQuery(
    { groupId: groupId },
    { enabled: !!groupId },
  );

  const members = membersQuery?.data?.memberCount;

  return (
    <>
      <Head>
        <title>MyApp</title>
        <meta name="description" content="App description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GroupHeader group={groupData} members={members ?? 0} />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
        <div className="container flex flex-col items-center justify-center gap-12 py-4 ">
          <Feed groupId={groupId} mode="GROUP" />
        </div>
      </div>
    </>
  );
}
