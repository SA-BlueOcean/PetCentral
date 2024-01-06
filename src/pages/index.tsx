import Feed from "@/components/Feed";
import { type GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { type ParsedUrlQuery } from "querystring";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx;

  return { props: { query } };
};

export default function Home({ query }: { query: ParsedUrlQuery }) {
  const mode = query?.mode;
  return (
    <>
      <Head>
        <title>PetPals</title>
        <meta name="description" content="PetPals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {(mode === "SUBS" || mode === "FRIENDS") && (
          <Link
            className="btn w-full bg-accent text-neutral"
            href={mode === "SUBS" ? "/group/mygroups" : "/friends"}
          >
            List My {mode === "SUBS" ? "Groups" : "Friends"}
          </Link>
        )}
        <Feed mode={mode === "FRIENDS" || mode === "SUBS" ? mode : "ALL"} />
      </div>
    </>
  );
}
