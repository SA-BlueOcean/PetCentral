import Head from 'next/head';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';
import Link from 'next/link';
import Image from 'next/image';


export default function Search() {
  const router = useRouter();
  const { query } = router;
  const searchTerm = query.query as string | undefined;
  const groupsResults = api.groups.searchGroups.useQuery(
    searchTerm ? { searchTerm: searchTerm, } : { searchTerm: '' }
  );
  return (
    <>
      <Head>
        <title>{searchTerm ? `Search results for: ${searchTerm} | PetPals` : 'Search | PetPals'}</title>
        <meta name="description" content="App description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {searchTerm ? (
        <div className="flex flex-col gap-4 w-full">Search results for: {searchTerm}
        {groupsResults.data?.groups.map((group) => (
          <div key={group.id} className="flex ring-base-500 rounded-lg bg-base-100 ring-1 p-3">
            <Link href={`/${group.id}`} className="relative h-10 w-10 overflow-clip rounded-lg bg-secondary ring-1 ring-base-200">
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
      </div>
      ) : (
        <div className="container mx-auto">
          Please enter a search term
        </div>
      )}
    </>
  );
}

