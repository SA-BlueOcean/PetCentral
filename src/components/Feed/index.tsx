import { api } from "@/utils/api";
import PostCard from "./PostCard";
import { cn } from "@/utils/cn";
import useInfiniteScroll from "./useInfiniteScroll";
import { useCallback, useRef, Fragment } from "react";
import { Loader } from "lucide-react";
import CreatePost from "./CreatePost";

type FeedProps = {
  mode: "PROFILE" | "GROUP" | "ALL";
  profileId?: string;
  groupId?: string;
};

export default function Feed({ mode, profileId, groupId }: FeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const posts = api.feed.get.useInfiniteQuery(
    {
      profileId,
      groupId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      enabled: !!(
        mode === "ALL" ||
        (mode === "PROFILE" && profileId) ||
        (mode === "GROUP" && groupId)
      ),
      keepPreviousData: true,
    },
  );

  const tryLoadMore = useCallback(() => {
    if (
      !(posts.isLoading || posts.isFetching || posts.isFetchingNextPage) ||
      !posts.hasNextPage
    ) {
      void posts.fetchNextPage();
    }
  }, [
    posts.isLoading,
    posts.isFetching,
    posts.isFetchingNextPage,
    posts.hasNextPage,
    posts.fetchNextPage,
  ]);

  useInfiniteScroll(scrollRef.current, tryLoadMore);

  return (
    <div className="w-full">
      <CreatePost />
      <ul className="flex w-full flex-col gap-4">
        {posts.data?.pages.map((page, i) => (
          <Fragment key={page.nextCursor}>
            {page.posts.map((p) => (
              <li key={p.id}>
                <PostCard data={p} />
              </li>
            ))}
            {/* <div className="text-center text-xs opacity-50">page {i + 1}</div> */}
          </Fragment>
        ))}
      </ul>
      <div
        ref={scrollRef}
        className={cn(
          posts.hasNextPage ? "h-20" : "h-0",
          "w-full",
          (posts.isLoading || posts.isFetching || posts.isFetchingNextPage) &&
            "flex items-center justify-center",
        )}
      >
        {posts.isLoading || posts.isFetching || posts.isFetchingNextPage ? (
          <Loader className="animate-spin" />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
