import Image from "next/image";
import Link from "next/link";
import PostText from "./PostText";
import Votes from "./Vote";
import { MessageSquareText } from "lucide-react";
import AvatarHeader from "./AvatarHeader";
import { useState } from "react";
import Comments from "./Comments";

type PostCardProps = {
  data: {
    id: number;
    content: string;
    createdAt: Date;
    upvotes: number;
    downvotes: number;
    numComments: number;
    createdBy: {
      id: string;
      name: string | null;
      firstName: string | null;
      lastName: string | null;
      profilePhotoUrl: string | null;
      bannerPhotoUrl: string | null;
    };
    group: {
      id: string;
      name: string;
      description: string | null;
      photoUrl: string | null;
    } | null;
    photos: {
      id: string;
      url: string;
    }[];
    votes?:
      | {
          id: number;
          userId: string;
          postId: number;
          vote: number;
        }[]
      | null;
  };
};

export default function PostCard({ data }: PostCardProps) {
  const [displayComments, setDisplayComments] = useState(false);
  const [numComments, setNumComments] = useState(data.numComments ?? 0);
  return (
    <div className="rounded-lg bg-base-100 ring-1 ring-base-500">
      <div className="p-3">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <AvatarHeader
              id={data.createdBy.id}
              profilePhotoUrl={data.createdBy.profilePhotoUrl}
              name={data.createdBy.name}
              createdAt={data.createdAt}
            />
          </div>
          {data.group?.id && (
            <Link
              href={`/group/${data?.group?.id}`}
              className="text-sm text-secondary hover:underline"
            >
              {data.group.name}
            </Link>
          )}
        </div>
        <div className="p-1">
          <PostText text={data.content} />
        </div>
        {/* TODO remove true & placeholder for demo purposes */}
        {data?.photos?.[0]?.url && (
          <div className="relative m-1 aspect-video w-full overflow-clip rounded-lg">
            <Image
              src={data?.photos?.[0]?.url}
              alt=""
              unoptimized
              fill
              className="object-cover z-10"
            />
            <div className="absolute inset-0 skeleton rounded-none bg-accent-content opacity-80"></div>
          </div>
        )}
      </div>

      <div className="flex justify-between border-t border-base-500 p-3">
        <Votes
          postId={data.id}
          upvotes={data.upvotes}
          downvotes={data.downvotes}
          vote={data.votes?.[0]?.vote}
        />
        <button
          className="btn btn-ghost h-10 min-h-10 rounded-l-full rounded-r-full"
          onClick={() => setDisplayComments((d) => !d)}
        >
          <MessageSquareText />
          <span>{numComments}</span>
        </button>
      </div>
      {displayComments && (
        <div className="max-h-[50vh] overflow-y-auto border-t border-base-500 p-3">
          <Comments
            postId={data.id}
            initialCount={data.numComments}
            onAddComment={() => setNumComments((c) => c + 1)}
          />
        </div>
      )}
    </div>
  );
}
