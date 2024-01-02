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
            <Link href={`/profile/${data.createdBy.id}`}>
              <div className="relative h-10 w-10 overflow-clip rounded-full bg-secondary ring-1 ring-base-200">
                {/* TODO remove true & placeholder for demo purposes */}
                {data.createdBy.profilePhotoUrl ?? true ? (
                  <Image
                    src={
                      data.createdBy?.profilePhotoUrl ??
                      "data:image/jpeg;base64,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"
                    }
                    alt=""
                    unoptimized
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <></>
                )}
              </div>
            </Link>

            <div className="flex flex-col">
              <Link
                href={`/profile/${data.createdBy.id}`}
                className="hover:underline"
              >
                {data.createdBy.name}
              </Link>
              <span className="text-xs">{data.createdAt.toLocaleString()}</span>
            </div>
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
        <div>
          up {data.upvotes} down {data.downvotes}
        </div>
        <div>{data.comments.length} comments</div>
      </div>
    </div>
  );
}
