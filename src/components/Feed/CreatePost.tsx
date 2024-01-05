import React, { useState } from "react";
import { useGlobalContext } from "@/providers/GlobalContext";
import { api } from "@/utils/api";
import { supabase } from "lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/env.js";
import Avatar from "./Avatar";

export default function CreatePost() {
  const [post, setPost] = useState({
    content: "",
    groupId: "",
  });
  const [image, setImage] = useState<File | null>(null);

  const mutation = api.posts.createPost.useMutation({});
  const photoMutation = api.posts.addPhoto.useMutation({});
  const { setDisplayLoginModal } = useGlobalContext();

  // Fetch User Details & Session Info
  const query = api.users.fetchUser.useQuery();

  // Fetch User's Groups
  const groupsQuery = api.groups.fetchGroups.useQuery();
  const utils = api.useUtils();
  const handleSubmit = async (
    e: { preventDefault: () => void } | undefined,
  ) => {
    e?.preventDefault();
    mutation.mutate(post, {
      onError(error: { message: string }) {
        if (error.message === "UNAUTHORIZED") {
          setDisplayLoginModal(true);
        }
      },
      onSuccess(data: Number | any) {
        const postId = data.postId;
        if (image) {
          getUrl(image, postId);
        }
        setPost({
          content: "",
          groupId: "",
        });
        void utils.feed.get.invalidate();
      },
    });
  };

  const getUrl = async (file: File | null, postId: Number | any) => {
    const filename = `${uuidv4()}`;
    const address = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${filename}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(filename, file!, {
        upsert: true,
      });
    handleSubmitImage(postId, address);
    return address;
  };

  const handleSubmitImage = (postId: number, photoUrl: string) => {
    photoMutation.mutate(
      { postId: postId, photoUrl: photoUrl },
      {
        onSuccess() {
          void utils.feed.get.invalidate();
        },
      },
    );
  };

  return (
    <form className="my-3 rounded-lg bg-base-100 ring-1 ring-base-500">
      <div className="p-3">
        <div className="flex">
          <div className="flex w-full items-center gap-2">
            <div className="relative h-10 w-10 flex-none overflow-clip rounded-full ">
              <Avatar profilePhotoUrl={query?.data?.user?.profilePhotoUrl} />
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Write a new post..."
                className="input input-ghost w-full pl-1"
                value={post.content}
                onChange={(e) => {
                  setPost({
                    ...post,
                    content: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-1">
          <select
            className="select select-ghost z-50 max-w-xs grow pl-1 text-secondary-content"
            value={post.groupId ?? undefined}
            onChange={(e) => {
              setPost({
                ...post,
                groupId: e.target.value,
              });
            }}
          >
            <option disabled selected defaultValue={undefined}>
              Choose a community
            </option>
            {groupsQuery?.data?.groups && (
              <>
                {groupsQuery?.data?.groups?.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </>
            )}
          </select>
          <div className="flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md "
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setImage(file!);
                }}
              />
            </label>
          </div>
          <button
            className="btn btn-primary btn-sm z-10 rounded-btn uppercase text-white"
            onClick={(e) => handleSubmit(e)}
          >
            Post
          </button>
        </div>
      </div>
    </form>
  );
}
