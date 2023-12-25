import { api } from "@/utils/api";
import PostCard from "./PostCard";

type FeedProps = {
  mode: "PROFILE" | "GROUP" | "ALL";
  profileId?: string;
  groupId?: string;
};

export default function Feed({ mode, profileId, groupId }: FeedProps) {
  const posts = api.feed.get.useInfiniteQuery(
    {
      profileId,
      groupId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!(
        mode === "ALL" ||
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        (mode === "PROFILE" && profileId) ||
        (mode === "GROUP" && groupId)
      ),
    },
  );

  const flatPosts = posts.data?.pages.flatMap((p) => p.posts);

  return (
    <div>
      <ul className="flex flex-col gap-4">
        {flatPosts?.map((p) => (
          <li key={p.id}>
            <PostCard data={p} />
          </li>
        ))}
      </ul>

      <button
        className="btn btn-neutral"
        disabled={posts.isFetchingNextPage}
        onClick={() => posts.fetchNextPage()}
      >
        {posts.isFetchingNextPage ? "loading.." : "load more"}
      </button>
    </div>
  );
}
