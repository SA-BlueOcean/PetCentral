import { useState } from "react";
import UploadFiles from "@/components/Profile/UploadFile";
import { api } from "@/utils/api";

export default function CreateGroupModal() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [groupDetails, setGroupDetails] = useState({
    name: "",
    description: "",
    photoUrl: "",
    bannerPhotoUrl: "",
  });

  const mutation = api.groups.create.useMutation({});

  if (modalIsOpen) {
    if (document) {
      document.getElementById("my_modal_5").showModal();
    }
  }

  const createGroup = async () => {
    console.log(groupDetails);
    mutation.mutate({
      name: groupDetails.name,
      description: groupDetails.description,
    });
  };

  const updatePhoto = async (url: string, type: string) => {
    if (type === "avatar") {
      setGroupDetails({ ...groupDetails, photoUrl: url });
    } else {
      setGroupDetails({ ...groupDetails, bannerPhotoUrl: url });
    }
  };

  return (
    <>
      <button className="btn" onClick={() => setModalIsOpen(true)}>
        open modal
      </button>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Create A New Group</h3>
          <p>Insert group information</p>
          <div className="modal-action">
            <form method="dialog">
              <label className="mr-4"> Group Name: </label>
              <input
                type="text"
                placeholder="Adopt-Dont-Shop"
                className="input my-3 w-full max-w-xs"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setGroupDetails({ ...groupDetails, name: e.target.value });
                }}
              />
              <label className="mr-4">Group Description:</label>
              <input
                type="textarea"
                placeholder="We love to rescue animals!"
                className="max-w-s input my-3 w-full"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setGroupDetails({
                    ...groupDetails,
                    description: e.target.value,
                  });
                }}
              />
              <label className="mr-4">Upload Group Avatar</label>
              <UploadFiles update={updatePhoto} />

              <label className="mr-4">Upload Group Banner</label>
              <UploadFiles update={updatePhoto} />
              <div>
                <button className="btn" onClick={() => createGroup()}>
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
