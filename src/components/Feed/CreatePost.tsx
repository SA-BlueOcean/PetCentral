import React, { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function CreatePost() {
  const { data } = useSession() || "";
  const [post, setPost] = useState({
    content: "",
    groupId: undefined,
  });
  const mutation = api.posts.createPost.useMutation({});

  // Fetch User Details & Session Info
  const query = api.users.fetchUser.useQuery(
    {
      userId: data?.user?.id!,
    },
    { enabled: !!data?.user?.id },
  );

  // Fetch User's Groups
  const groupsQuery = api.groups.fetchGroups.useQuery();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(post);
  };

  return (
    <form className="rounded-lg bg-base-100 ring-1 ring-base-500">
      <div className="p-3">
        <div className="flex">
          <div className="flex w-full items-center gap-2">
            <div className="relative h-10 w-10 overflow-clip rounded-full ">
              <div className="avatar">
                <div className="h-10 w-10 rounded-full">
                  {query?.data?.profilePhotoUrl ? (
                    <>
                      <Image
                        src={query?.data?.profilePhotoUrl}
                        alt="user avatar"
                        unoptimized={true}
                        fill={true}
                      />
                    </>
                  ) : (
                    <Image
                      src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                      alt="user avatar"
                      unoptimized={true}
                      fill={true}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Write a new post..."
                className="input input-ghost w-full pl-1"
                onChange={(e) =>
                  setPost({
                    ...post,
                    content: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-1">
          <select
            className="select select-ghost max-w-xs grow pl-1 text-secondary-content"
            onChange={(e) => {
              setPost({
                ...post,
                groupId: e.target.value || undefined,
              });
            }}
          >
            <option disabled selected>
              Choose a community
            </option>
            {groupsQuery?.data?.groups && (
              <>
                {" "}
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
              />
            </label>
          </div>
          <button
            className="btn btn-primary btn-sm rounded-btn uppercase text-white"
            onClick={(e) => handleSubmit(e)}
          >
            Post
          </button>
        </div>
      </div>
    </form>
  );
}
