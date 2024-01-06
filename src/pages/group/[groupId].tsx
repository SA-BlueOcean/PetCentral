import Head from "next/head";
import Feed from "@/components/Feed";
import { useRouter } from "next/router";
import { GroupHeader } from "@/components/Group/GroupHeader";

export default function GroupPage() {
  const router = useRouter();
  const groupId = router.query.groupId! as string;

  return (
    <>
      <Head>
        <title>MyApp</title>
        <meta name="description" content="App description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GroupHeader groupId={groupId} />
      <Feed groupId={groupId} mode="GROUP" />
    </>
  );
}
