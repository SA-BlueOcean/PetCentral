import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';


export default function Search() {
  const router = useRouter();
  const { query } = router;
  const searchTerm = query.query as string | undefined;
  const groupsResults = api.groups.searchGroups.useQuery(
    searchTerm ? { searchTerm: searchTerm, } : { searchTerm: '' }
  );
  const postsResults = api.feed.get.useQuery(
    searchTerm ? { searchTerm: searchTerm, } : { searchTerm: '' }
  );

  return (
    <>
      <Head>
        <title>{searchTerm ? `Search results for: ${searchTerm} | PetCentral` : 'Search | PetCentral'}</title>
        <meta name="description" content="App description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {searchTerm ? (
        <h1 className="flex flex-col gap-4 w-full">Search results for: {searchTerm}
          {groupsResults ? (
            <h2 className="flex flex-col gap-4 w-full">Groups
              {groupsResults.data?.groups.map((group) => (
                <div key={group.id} className="flex ring-base-500 rounded-lg bg-base-100 ring-1 p-3">
                  <Link href={`/group/${group.id}`} className="relative h-10 w-10 overflow-clip rounded-lg bg-secondary ring-1 ring-base-200">
                    <Image src={`${group.photoUrl}`} alt={`Image for ${group.name}`} width={50} height={50} unoptimized={true}/>
                  </Link>
                  <div className="flex flex-col mx-4">
                    <Link href={`/group/${group.id}`} >
                        <h2>{group.name}</h2>
                    </Link>
                    <p>{group.description}</p>
                  </div>
                </div>
              ))}
            </h2>
        ) : (
          <div className="container mx-auto">
            No matching groups
          </div>
        )}
        {postsResults ? (
          <h2 className="flex flex-col gap-4 w-full">Posts
            {postsResults.data?.posts.map((post) => (
              <div key={post.id} className="flex ring-base-500 rounded-lg bg-base-100 ring-1 p-3">
                <Link href={`profile/${post.createdById}`} className="relative h-10 w-10 overflow-clip rounded-full bg-secondary ring-1 ring-base-200">
                  <Image src={`${post?.photos[0] || ''}`} alt={`Image for ${post.id}`} width={50} height={50} unoptimized={true}/>
                </Link>
                <div className="flex flex-col mx-4">
                  <Link href={`/profile/${post.createdById}`} >
                      <h2>{post.createdBy.name}</h2>
                  </Link>
                  <p>{post.content}</p>
                </div>
              </div>
            ))}
          </h2>
        ) : (
          <div className="container mx-auto">
            No matching posts
          </div>
        )}
      </h1>
      ) : (
        <div className="container mx-auto">
          Please enter a search term
        </div>
      )}
    </>
  );

}

