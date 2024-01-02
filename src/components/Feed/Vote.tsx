import { ThumbsUp, ThumbsDown } from "lucide-react";

type VotesProps = {
  upvotes: number;
  downvotes: number;
};

export default function Votes({ upvotes, downvotes }: VotesProps) {
  return (
    <div className="join">
      <button className="btn btn-ghost join-item h-10 min-h-10 rounded-l-full">
        <ThumbsUp />
        <span>{upvotes}</span>
      </button>
      <button className="btn btn-ghost join-item h-10 min-h-10 rounded-r-full">
        <ThumbsDown />
        <span>{downvotes}</span>
      </button>
    </div>
  );
}
