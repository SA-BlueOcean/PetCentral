import { env } from "@/env.js";
import { useGlobalContext } from "@/providers/GlobalContext";
import { api } from "@/utils/api";
import { supabase } from "lib/supabase";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Avatar from "./Avatar";

export default function CreatePost() {
  const session = useSession();
  const [post, setPost] = useState({
    content: "",
    groupId: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const mutation = api.posts.createPost.useMutation({});
  const { setDisplayLoginModal } = useGlobalContext();

  // Fetch User Details & Session Info
  const query = api.users.fetchUser.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });

  // Fetch User's Groups
  const groupsQuery = api.groups.fetchGroups.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });
  const utils = api.useUtils();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    try {
      setLoading(true);
      if (image) {
        await submitWithImage(image);
      } else {
        await handleSubmitPost();
      }
    } catch (err) {
      console.log("post error", err);
    } finally {
      setLoading(false);
    }
  };

  const submitWithImage = async (file: File | null) => {
    if (session.status === "authenticated") {
      const filename = `${uuidv4()}`;
      const address = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${filename}`;
      const { error } = await supabase.storage
        .from("images")
        .upload(filename, file!, {
          upsert: true,
        });
      if (!error) {
        await handleSubmitPost(address);
      }
    } else {
      setDisplayLoginModal(true);
    }
  };

  const handleSubmitPost = async (photoUrl?: string) => {
    await new Promise((res, rej) => {
      mutation.mutate(
        { ...post, photoUrl: photoUrl },
        {
          onError(error: { message: string }) {
            if (error.message === "UNAUTHORIZED") {
              setDisplayLoginModal(true);
            }
            rej(error);
          },
          onSuccess: () => {
            utils.feed.get
              .invalidate()
              .catch((err) => {
                console.log("feedvalidateerr", err);
              })
              .finally(() => {
                setPost({
                  content: "",
                  groupId: "",
                });
                setImage(null);
                res(null);
              });
          },
        },
      );
    });
  };

  return (
    <form
      className="my-3 rounded-lg bg-base-100 ring-1 ring-base-400"
      onSubmit={handleSubmit}
    >
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
        {image && (
          <div className="relative m-1 my-2 aspect-video w-full overflow-clip rounded-lg">
            <button
              className="btn btn-circle absolute right-2 top-2 z-10 h-6 min-h-6 w-6 min-w-6"
              type="button"
              onClick={() => setImage(null)}
            >
              &times;
            </button>
            <Image
              src={URL.createObjectURL(image)}
              alt=""
              unoptimized
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex items-center justify-between p-1">
          <select
            className="select select-ghost z-50 max-w-xs grow pl-1 text-secondary-content"
            value={post.groupId ?? ""}
            defaultValue={""}
            onChange={(e) => {
              setPost((p) => ({
                ...p,
                groupId: e.target.value,
              }));
            }}
          >
            <option value={""}>Choose a community</option>
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
            disabled={
              (loading || groupsQuery.isLoading || query.isLoading) &&
              !(session.status === "unauthenticated")
            }
            className="btn btn-accent btn-sm z-10 w-16 rounded-btn uppercase text-white"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : "Post"}
          </button>
        </div>
      </div>
    </form>
  );
}
