import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { Loader } from "lucide-react";
import { Fragment, useCallback, useRef } from "react";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import useInfiniteScroll from "./useInfiniteScroll";

type FeedProps = {
  mode: "PROFILE" | "GROUP" | "ALL" | "SUBS" | "FRIENDS";
  profileId?: string;
  groupId?: string;
};

export default function Feed({ mode, profileId, groupId }: FeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const enabled = !!(
    ((mode === "ALL" || mode == "SUBS" || mode === "FRIENDS") &&
      !profileId &&
      !groupId) ||
    (mode === "PROFILE" && profileId) ||
    (mode === "GROUP" && groupId)
  );
  const posts = api.feed.get.useInfiniteQuery(
    {
      profileId,
      groupId,
      mode,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      enabled: enabled,
      keepPreviousData: true,
      refetchInterval: 20000,
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

  const page0props = posts.data?.pages?.[0]?.props;
  const matchProps =
    page0props?.mode === mode &&
    (groupId
      ? page0props.groupId === groupId
      : profileId
        ? page0props.profileId === profileId
        : true);

  return (
    <div className="w-full">
      <CreatePost />
      <ul className="flex w-full flex-col gap-4">
        {enabled &&
          matchProps &&
          posts.data?.pages.map((page) => (
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
          "flex h-20 w-full items-center justify-center",
          (posts.isLoading || posts.isFetching || posts.isFetchingNextPage) &&
            "flex items-center justify-center",
        )}
      >
        {posts.isLoading || posts.isFetching || posts.isFetchingNextPage ? (
          <Loader className="animate-spin" />
        ) : (posts.data?.pages?.flatMap((p) => p.posts).length ?? 0) < 1 ? (
          <div className="text-center opacity-50">nothing here</div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
