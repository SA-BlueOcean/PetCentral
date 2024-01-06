import { api } from "@/utils/api";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Search() {
  const router = useRouter();
  const { query } = router;
  const searchTerm = query.query as string | undefined;
  const groupsResults = api.groups.searchGroups.useQuery(
    searchTerm ? { searchTerm: searchTerm } : { searchTerm: "" },
  );
  const postsResults = api.feed.get.useQuery(
    searchTerm ? { searchTerm: searchTerm } : { searchTerm: "" },
  );

  return (
    <>
      <Head>
        <title>
          {searchTerm
            ? `Search results for: ${searchTerm} | PetPals`
            : "Search | PetPals"}
        </title>
        <meta name="description" content="App description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {searchTerm ? (
        <h1 className="flex w-full flex-col gap-4">
          Search results for: {searchTerm}
          {groupsResults ? (
            <h2 className="flex w-full flex-col gap-4">
              Groups
              {groupsResults.data?.groups.map((group) => (
                <div
                  key={group.id}
                  className="flex rounded-lg bg-base-100 p-3 ring-1 ring-base-500"
                >
                  <Link
                    href={`/group/${group.id}`}
                    className="relative h-10 w-10 overflow-clip rounded-lg bg-secondary ring-1 ring-base-200"
                  >
                    <Image
                      src={`${group.photoUrl}`}
                      alt={`Image for ${group.name}`}
                      width={50}
                      height={50}
                      unoptimized={true}
                    />
                  </Link>
                  <div className="mx-4 flex flex-col">
                    <Link href={`/group/${group.id}`}>
                      <h2>{group.name}</h2>
                    </Link>
                    <p>{group.description}</p>
                  </div>
                </div>
              ))}
            </h2>
          ) : (
            <div className="container mx-auto">No matching groups</div>
          )}
          {postsResults ? (
            <h2 className="flex w-full flex-col gap-4">
              Posts
              {postsResults.data?.posts.map((post) => (
                <div
                  key={post.id}
                  className="flex rounded-lg bg-base-100 p-3 ring-1 ring-base-500"
                >
                  <Link
                    href={`profile/${post.createdById}`}
                    className="relative h-10 w-10 flex-none overflow-clip rounded-full bg-secondary ring-1 ring-base-200"
                  >
                    {post?.photos?.[0]?.url && (
                      <Image
                        src={`${post?.photos[0]?.url || ""}`}
                        alt={`Image for ${post.id}`}
                        unoptimized={true}
                        fill
                        className="object-cover"
                      />
                    )}
                  </Link>
                  <div className="mx-4 flex flex-col">
                    <Link href={`/profile/${post.createdById}`}>
                      <h2>{post.createdBy.name}</h2>
                    </Link>
                    <p>{post.content}</p>
                  </div>
                </div>
              ))}
            </h2>
          ) : (
            <div className="container mx-auto">No matching posts</div>
          )}
        </h1>
      ) : (
        <div className="container mx-auto">Please enter a search term</div>
      )}
    </>
  );
}
