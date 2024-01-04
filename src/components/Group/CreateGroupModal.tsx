import { useState } from "react";
import { api } from "@/utils/api";
import { useGlobalContext } from "@/providers/GlobalContext";

export default function CreateGroupModal() {
  const { setDisplayLoginModal } = useGlobalContext();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [groupDetails, setGroupDetails] = useState({
    name: "",
    description: "",
    photoUrl:
      "https://i0.wp.com/www.maisonette.gr/wp-content/uploads/2018/01/pet-icon.png?ssl=1",
    bannerPhotoUrl:
      "https://media.istockphoto.com/id/1680422522/photo/group-of-pets-leaning-together-on-a-empty-web-banner-to-place-text-cats-dogs-rabbit-ferret.webp?b=1&s=170667a&w=0&k=20&c=Ut6bhDDea20-643SfrVtMv7jTmfI80nKZBy1fC4gcF4=",
  });
  const utils = api.useUtils();
  const mutation = api.groups.create.useMutation({});

  if (modalIsOpen) {
    if (document) {
      const modalElement = document?.getElementById("my_modal");
      if (modalElement) {
        if (modalElement instanceof HTMLDialogElement) {
          modalElement.showModal();
        } else {
          modalElement?.closest("dialog")?.close();
        }
      }
    }
  }

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
          void utils.groups.findAllGroups.invalidate();
        },
      },
    );
  };

  return (
    <>
      <button
        className="btn-s btn btn-primary basis-1/5 rounded-btn uppercase text-white"
        onClick={() => setModalIsOpen(true)}
      >
        Create A Group
      </button>
      <dialog id="my_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-primary text-white">
          <button
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
            onClick={() => setModalIsOpen(false)}
          >
            ✕
          </button>
          <h3 className="text-lg font-bold ">Create A New Group</h3>
          <div className="mt- modal-action">
            <form method="dialog">
              <label className="mr-4"> Group Name:</label>
              <input
                type="text"
                placeholder="Adopt-Dont-Shop"
                className="input my-3 w-full max-w-xs bg-primary focus:outline-none"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setGroupDetails({ ...groupDetails, name: e.target.value });
                }}
              />
              <label className="mr-4">Group Description:</label>
              <input
                type="textarea"
                placeholder="We love to rescue animals!"
                className="max-w-s input my-3 w-full bg-primary focus:outline-none"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setGroupDetails({
                    ...groupDetails,
                    description: e.target.value,
                  });
                }}
              />
              <button
                className="btn mx-auto mt-4 border-none bg-secondary text-white"
                onClick={() => {
                  createGroup();
                  setModalIsOpen(false);
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
