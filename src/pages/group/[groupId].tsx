import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import { Example } from "@/components/Example";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { GroupHeader } from "@/components/Group/GroupHeader.tsx";

const groupData = {
  id: "123",
  name: "Whisker Watchers Club",
  description: "A group dedicated to cat lovers.",
  photoUrl: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  bannerPhotoUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1460&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
}
const members = 2;

export default function GroupPage({ group }) {

  const hello = api.example.hello.useQuery({ text: "example hi" });

  const router = useRouter();
  const groupId = router.query.groupId;

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

      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b ">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight  sm:text-[5rem]">
            Group page group {groupId}
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-primary-content p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl  font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-secondary p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div>
          <p className="text-2xl ">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
          <Example />
        </div>
      </main>
    </>
  );
}
