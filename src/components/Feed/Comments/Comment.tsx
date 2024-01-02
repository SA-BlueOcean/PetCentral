import AvatarHeader from "../AvatarHeader";
import PostText from "../PostText";

type CommentProps = {
  data: {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    upvotes: number;
    downvotes: number;
    createdById: string;
    createdBy: {
      id: string;
      name: string | null;
      firstName: string | null;
      lastName: string | null;
      profilePhotoUrl: string | null;
    };
  };
};
export default function Comment({ data }: CommentProps) {
  return (
    <div className="p-2 rounded-lg bg-base-200 flex flex-col gap-1">
      <div className="flex gap-2">
        <AvatarHeader
          id={data.createdBy.id}
          name={data.createdBy.name}
          profilePhotoUrl={data.createdBy.profilePhotoUrl}
          createdAt={data.createdAt}
          mode="COMMENT"
        />
      </div>

      <PostText text={data.content} />
    </div>
  );
}
