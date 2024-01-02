import { api } from "@/utils/api";
import { Fragment } from "react";
import Comment from "./Comment";

export default function Comments({ postId }: { postId: number }) {
  const comments = api.comments.get.useInfiniteQuery(
    {
      postId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <ul className="flex flex-col gap-4">
        {comments.data?.pages.map((page, i) => (
          <Fragment key={page.nextCursor}>
            {page.comments.map((c) => (
              <li key={c.id}>
                <Comment data={c} />
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
      {comments.hasNextPage && (
        <button
          disabled={comments.isFetchingNextPage}
          className="btn h-8 min-h-8"
          onClick={() => comments.fetchNextPage()}
        >
          load more
        </button>
      )}
    </div>
  );
}
