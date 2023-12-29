import { useState } from "react";
import { api } from "@/utils/api";

export default function EditPhotosModals({ profileId }: { profileId: string }) {
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");

  // setup mutations for updating photos at Profile ID
  api.profile.update.useMutation({ profilePhotoUrl, coverPhotoUrl, profileId });

  return (
    <dialog id="my_modal_3" className="modal">
      <div className="pl-100 modal-box  w-11/12 max-w-3xl">
        <div className="modal-action">
          <form method="dialog">
            <button
              className="btn modal-action absolute right-0 top-0 m-6"
              data-micromodal-close
            >
              &times;
            </button>
          </form>
        </div>
        <h3 className="text-center text-lg font-bold">Update Your Photos:</h3>
        <div className="flex justify-center pl-3">
          <form>
            <label> Profile Photo URL: </label>
            <div>
              <input
                type="text"
                value={profilePhotoUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProfilePhotoUrl(e.target.value)
                }
              />
            </div>
            <label> Banner Photo URL: </label>
            <div>
              <input
                type="text"
                value={coverPhotoUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCoverPhotoUrl(e.target.value)
                }
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
