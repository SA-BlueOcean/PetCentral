import { useState, useEffect } from "react";
import Head from "next/head";
import Feed from "@/components/Feed";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { GroupHeader } from "@/components/Group/GroupHeader";
import { useSession } from "next-auth/react";
import CreatePost from "@/components/Feed/CreatePost";

export default function GroupPage() {
  const { data } = useSession() || "";
  const [groupData, setGroupData] = useState({});

  const router = useRouter();
  const groupId = router.query.groupId! as string;

  // Fetch Group Details
  const query = api.groups.fetchDetails.useQuery({
    groupID: groupId,
  });

  // Fetch Group Members
  const membersQuery = api.groups.fetchMemberCount.useQuery(
    { groupId: groupId },
    { enabled: !!groupId },
  );

  const members = membersQuery?.data?.memberCount;

  useEffect(() => {
    if (query.data) {
      setGroupData(query?.data?.group ?? {});
    }
  });

  return (
    <>
      <Head>
        <title>MyApp</title>
        <meta name="description" content="App description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GroupHeader group={groupData} members={members} />
      <CreatePost />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b ">
        <div className="container flex flex-col items-center justify-center gap-12 py-16 ">
          <Feed groupId={groupId} mode="GROUP" />
        </div>
      </main>
    </>
  );
}
