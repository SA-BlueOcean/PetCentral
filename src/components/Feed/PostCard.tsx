import Image from "next/image";
import Link from "next/link";
import PostText from "./PostText";

type PostCardProps = {
  data: {
    id: number;
    content: string;
    createdAt: Date;
    upvotes: number;
    downvotes: number;
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
    comments: {
      id: number;
      content: string;
      createdAt: Date;
      updatedAt: Date;
      upvotes: number;
      downvotes: number;
      createdById: string;
    }[];
  };
};

export default function PostCard({ data }: PostCardProps) {
  return (
    <div className="ring-base-500 rounded-lg bg-base-100 ring-1">
      <div className="p-3">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 overflow-clip rounded-full bg-neutral">
              {data.createdBy.profilePhotoUrl ? (
                <Image
                  src={data.createdBy.profilePhotoUrl}
                  alt=""
                  unoptimized
                  fill
                />
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-col">
              <span>{data.createdBy.name}</span>
              <span className="text-sm">{data.createdAt.toLocaleString()}</span>
            </div>
          </div>
          {data.group?.id && (
            <Link
              href={`/group/${data?.group?.id}`}
              className="text-sm text-secondary"
            >
              {data.group.name}
            </Link>
          )}
        </div>
        <div>
          <PostText text={data.content} />
        </div>
        {data?.photos?.[0]?.url && (
          <div className="m-1 aspect-video w-full overflow-clip rounded-lg bg-neutral-content">
            <Image src={data?.photos?.[0]?.url} alt="" unoptimized fill />
          </div>
        )}
      </div>

      <div className="border-base-500 flex justify-between border-t p-3">
        <div>
          {" "}
          up {data.upvotes} down {data.downvotes}
        </div>
        <div>{data.comments.length} comments</div>
      </div>
    </div>
  );
}
