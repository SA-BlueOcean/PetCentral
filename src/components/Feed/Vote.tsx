import { useGlobalContext } from "@/providers/GlobalContext";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

type VotesProps = {
  upvotes: number;
  downvotes: number;
  vote?: number | null;
  postId: number;
};

export default function Votes({
  upvotes,
  downvotes,
  vote,
  postId,
}: VotesProps) {
  const [voteDir, setVoteDir] = useState<number | undefined>(vote ?? 0);
  const voteMutation = api.feed.vote.useMutation();
  const session = useSession();
  const { setDisplayLoginModal } = useGlobalContext();
  const doVote = (direction: number) => {
    if (!session.data?.user.id) {
      setDisplayLoginModal(true);
    } else {
      setVoteDir(direction);
      voteMutation.mutate(
        { postId, vote: direction },
        {
          onError(error, variables, context) {
            if (error.message === "UNAUTHORIZED") {
              setDisplayLoginModal(true);
            }
            setVoteDir(vote ?? 0);
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
        <ThumbsUp />
        <span>{upvotes}</span>
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
        <ThumbsDown />
        <span>{downvotes}</span>
      </button>
    </div>
  );
}
