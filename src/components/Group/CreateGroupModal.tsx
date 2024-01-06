import { useGlobalContext } from "@/providers/GlobalContext";
import { api } from "@/utils/api";
import { useState } from "react";

export default function CreateGroupModal() {
  const { setDisplayLoginModal } = useGlobalContext();
  const [groupDetails, setGroupDetails] = useState({
    name: "",
    description: "",
    photoUrl:
      "https://wbcribkoduulenxqfpyg.supabase.co/storage/v1/object/public/images/62498a2f-a76f-4100-9ff4-d433412d1384",
    bannerPhotoUrl:
      "https://wbcribkoduulenxqfpyg.supabase.co/storage/v1/object/public/images/62498a2f-a76f-4100-9ff4-d433412d1384",
  });

  const utils = api.useUtils();
  const mutation = api.groups.create.useMutation({});

  const createGroup = async () => {
    mutation.mutate(
      {
        name: groupDetails.name,
        description: groupDetails.description,
        photoUrl: groupDetails.photoUrl,
        bannerPhotoUrl: groupDetails.bannerPhotoUrl,
      },
      {
        onError(error: { message: string }) {
          if (error.message === "UNAUTHORIZED") {
            setDisplayLoginModal(true);
          }
        },
        onSuccess() {
          setGroupDetails({
            ...groupDetails,
            name: "",
            description: "",
          });
          console.log(groupDetails);
          void utils.groups.fetchGroups.invalidate();
        },
      },
    );
  };

  return (
    <>
      <button
        className="btn-s btn btn-accent basis-1/5 rounded-btn uppercase text-base-100"
        onClick={() => {
          (
            document.getElementById(
              "create_group_modal",
            ) as HTMLDialogElement | null
          )?.showModal?.();
        }}
      >
        Create A Group
      </button>
      <dialog
        id="create_group_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-base-300 text-base-700">
          <button
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
            onClick={() => {
              (
                document.getElementById(
                  "create_group_modal",
                ) as HTMLDialogElement | null
              )
                ?.closest("dialog")
                ?.close();
            }}
          >
            ✕
          </button>
          <h3 className="text-lg font-bold ">Create A New Group</h3>
          <div className="mt- modal-action">
            <form method="dialog" onSubmit={(e) => e.preventDefault()}>
              <label className="mr-4"> Group Name:</label>
              <input
                type="text"
                placeholder="Adopt-Dont-Shop"
                className="input my-3 w-full max-w-xs bg-base-100 focus:outline-none"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setGroupDetails({ ...groupDetails, name: e.target.value });
                }}
              />
              <label className="mr-4">Group Description:</label>
              <input
                type="textarea"
                placeholder="We love to rescue animals!"
                className="max-w-s input my-3 w-full bg-base-100 focus:outline-none"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setGroupDetails({
                    ...groupDetails,
                    description: e.target.value,
                  });
                }}
              />
              <button
                className="btn mx-auto mt-4 border-none bg-accent text-base-100"
                onClick={() => {
                  createGroup();
                  (
                    document.getElementById(
                      "create_group_modal",
                    ) as HTMLDialogElement | null
                  )
                    ?.closest("dialog")
                    ?.close();
                }}
              >
                Create Group
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
