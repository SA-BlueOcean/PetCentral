import { useGlobalContext } from "@/providers/GlobalContext";
import { api, type RouterOutputs } from "@/utils/api";
import { cn } from "@/utils/cn";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

type VotesProps = {
  upvotes: number;
  downvotes: number;
  postId: number;
  vote?: number | null;
};

type FeedQuery = RouterOutputs["feed"]["get"];

export default function Votes({
  upvotes,
  downvotes,
  vote,
  postId,
}: VotesProps) {
  const [voteDir, setVoteDir] = useState<number | undefined>(vote ?? 0);
  const [upvoteCount, setUpvoteCount] = useState(upvotes);
  const [downvoteCount, setDownVoteCount] = useState(downvotes);
  const session = useSession();
  const { setDisplayLoginModal } = useGlobalContext();
  const queryClient = useQueryClient();
  const queryKey = getQueryKey(api.feed.get, undefined, "infinite");
  const voteMutation = api.feed.vote.useMutation({
    // updates the post vote data on voting
    onSuccess: async (data) => {
      if (!queryKey) return;
      queryClient.setQueriesData<InfiniteData<FeedQuery>>(queryKey, (prev) => {
        const update = prev?.pages.map((page) => ({
          ...page,
          posts: page.posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                upvotes: data.post.upvotes,
                downvotes: data.post.downvotes,
                votes: [
                  {
                    id: data.vote.id,
                    postId: data.vote.postId,
                    userId: data.vote.userId,
                    vote: data.vote.vote,
                  },
                ],
              };
            }
            return post;
          }),
        }));
        if (prev && update) {
          prev.pages = update;
        }
        return prev;
      });
    },
  });

  const doVote = (direction: number) => {
    if (!session.data?.user.id) {
      setDisplayLoginModal(true);
    } else {
      // already voted, don't do anything
      if (voteDir === direction) {
        return;
      }

      //optimistically update the vote counts
      if (direction === 1) {
        setUpvoteCount((c) => c + 1);
        if (voteDir === -1) {
          setDownVoteCount((c) => c - 1);
        }
      }
      if (direction === -1) {
        setDownVoteCount((c) => c + 1);
        if (voteDir === 1) {
          setUpvoteCount((c) => c - 1);
        }
      }
      if (direction === 0) {
        if (voteDir === 1) {
          setUpvoteCount((c) => c - 1);
        } else if (voteDir === -1) {
          setDownVoteCount((c) => c - 1);
        }
      }
      setVoteDir(direction);
      voteMutation.mutate(
        { postId, vote: direction },
        {
          onError(error, variables, context) {
            if (error.message === "UNAUTHORIZED") {
              setDisplayLoginModal(true);
            }
            // reset optimistic updates
            setVoteDir(vote ?? 0);
            setUpvoteCount(upvotes);
            setDownVoteCount(downvotes);
          },
        },
      );
    }
  };

  return (
    <div className="join">
      <button
        disabled={voteMutation.isLoading}
        className={cn(
          "btn join-item h-10 min-h-10 rounded-l-full",
          voteDir === 1 ? "btn-accent" : "btn-ghost",
        )}
        onClick={() => {
          doVote(voteDir === 1 ? 0 : 1);
        }}
      >
        <ThumbsUp
          className={cn(voteDir === 1 ? "text-base-100" : "text-base-600")}
        />
        <span className={cn(voteDir === 1 ? "text-base-100" : "text-base-600")}>
          {upvoteCount}
        </span>
      </button>
      <button
        disabled={voteMutation.isLoading}
        className={cn(
          "btn btn-ghost join-item h-10 min-h-10 rounded-r-full",
          voteDir === -1 ? "bg-warning" : "",
        )}
        onClick={() => {
          doVote(voteDir === -1 ? 0 : -1);
        }}
      >
        <ThumbsDown className="text-base-600" />
        <span className="text-base-600">{downvoteCount}</span>
      </button>
    </div>
  );
}
