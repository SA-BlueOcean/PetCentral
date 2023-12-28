import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { GroupHeader } from "@/components/Group/GroupHeader";
import PostCard from "@/components/Feed/PostCard";
import { useSession } from "next-auth/react";
import CreatePost from '@/components/Feed/CreatePost';


const members = 2;

export default function GroupPage() {
  const { data } = useSession() || '';
  console.log(data);
  const [groupData, setGroupData] = useState({});
  const [posts, setPosts] = useState([]);
  // const hello = api.example.hello.useQuery({ text: "example hi" });

  const router = useRouter();
  const groupId = router.query.groupId;

  // Fetch Group Details
  const query = api.groups.fetchDetails.useQuery({
    groupID: groupId,
  });

  // Fetch Group Posts
  const postsQuery = api.groups.getGroupPosts.useQuery({
    groupId: groupId,
  });

  useEffect(() => {
    if (query.data) {
      setGroupData(query.data.group);
    }
    if (postsQuery.data) {
      setPosts(postsQuery.data.posts);
    }
  });

  return (
    <>
      <Head>
        <title>MyApp</title>
        <meta name="description" content="App description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GroupHeader
        group={ groupData }
        members={members}
      />
      {/* <CreatePost profileId={data} /> */}
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b ">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <ul className="flex flex-col gap-4">
            {postsQuery.data?.posts.map((p) => (
              <li key={p.id}>
                <PostCard data={p} />
              </li>
            ))}
            </ul>
        </div>
      </main>
    </>
  );
}
