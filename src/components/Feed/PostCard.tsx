import Image from "next/image";
import Link from "next/link";
import PostText from "./PostText";
import Votes from "./Vote";
import { MessageSquareText } from "lucide-react";
import AvatarHeader from "./AvatarHeader";

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
    votes?: {
      id: number;
      userId: string;
      postId: number;
      vote: number;
    }[] | null;
  };
};

export default function PostCard({ data }: PostCardProps) {
  return (
    <div className="ring-base-500 rounded-lg bg-base-100 ring-1">
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
        {(data?.photos?.[0]?.url ?? true) && (
          <div className="relative m-1 aspect-video w-full overflow-clip rounded-lg bg-neutral-content">
            <Image
              src={
                data?.photos?.[0]?.url ??
                "https://images.unsplash.com/photo-1557481944-1582c12380dd?q=80&w=2660&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt=""
              unoptimized
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </div>

      <div className="border-base-500 flex justify-between border-t p-3">
        <Votes
          postId={data.id}
          upvotes={data.upvotes}
          downvotes={data.downvotes}
          vote={data.votes?.[0]?.vote}
        />
        <button className="btn btn-ghost h-10 min-h-10 rounded-l-full rounded-r-full">
          <MessageSquareText  />
          <span>{data.numComments ?? 0}</span>
        </button>
      </div>
    </div>
  );
}
