import { useGlobalContext } from "@/providers/GlobalContext";
import { type RouterOutputs, api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Avatar from "../Avatar";
import { cn } from "@/utils/cn";
import { getQueryKey } from "@trpc/react-query";
import { type InfiniteData, useQueryClient } from "@tanstack/react-query";

export default function CreateComment({
  postId,
  onAddComment,
}: {
  postId: number;
  onAddComment?: () => void;
}) {
  const [comment, setComment] = useState("");
  const session = useSession();
  const user = api.profile.get.useQuery(
    session?.data?.user?.id ? { profileId: session.data.user.id } : undefined,
    { enabled: !!session.data?.user.id },
  );
  const mutate = api.comments.create.useMutation();
  const utils = api.useUtils();
  type FeedQuery = RouterOutputs["feed"]["get"];
  const queryKey = getQueryKey(api.feed.get, undefined, "infinite");
  const queryClient = useQueryClient();
  const { setDisplayLoginModal } = useGlobalContext();
  const handleSubmit = () => {
    mutate.mutate(
      {
        content: comment,
        postId,
      },
      {
        onError(error, variables, context) {
          if (error.message === "UNAUTHORIZED") {
            setDisplayLoginModal(true);
          }
        },
        onSuccess(data, variables, context) {
          setComment("");
          onAddComment && onAddComment();
          void utils.comments.get.invalidate({ postId });
          queryClient.setQueriesData<InfiniteData<FeedQuery>>(
            queryKey,
            (prev) => {
              const update = prev?.pages.map((page) => ({
                ...page,
                props: page.props,
                posts: page.posts.map((post) => {
                  if (post.id === postId) {
                    return {
                      ...post,
                      numComments: post.numComments + 1,
                    };
                  }
                  return post;
                }),
              }));
              if (prev && update) {
                prev.pages = update;
              }
              return prev;
            },
          );
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-2">
      {session.data?.user.id && (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "bg-base-400 relative h-6 w-6 overflow-clip rounded-full",
              user.isLoading && "skeleton",
            )}
          >
            {!user.isLoading && (
              <Avatar profilePhotoUrl={user.data?.profilePhotoUrl} />
            )}
          </div>
          {!user.isLoading ? (
            <span>
              {user?.data?.firstName
                ? `${user?.data?.firstName}${
                    user?.data?.lastName ? ` ${user.data.lastName}` : ""
                  }`
                : `${user?.data?.name ?? "?"}`}
            </span>
          ) : (
            <div className="skeleton h-6 w-20 rounded-md bg-base-200 "></div>
          )}
        </div>
      )}

      <textarea
        className="textarea textarea-bordered h-16"
        placeholder="post your reply"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        disabled={mutate.isLoading}
        className="btn btn-accent ml-auto h-10 min-h-10 w-20 text-neutral"
        onClick={handleSubmit}
      >
        submit
      </button>
    </div>
  );
}
