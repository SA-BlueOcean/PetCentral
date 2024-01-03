import { useState } from "react";
import { api } from "@/utils/api";
import UploadFiles from "@/components/Profile/UploadFile";

export default function EditPhotosModal({ profileId }: { profileId: string }) {
  // const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  // const [coverPhotoUrl, setCoverPhotoUrl] = useState("");

  // setup mutations for updating photos at Profile ID
  const mutation = api.profile.updatePhotos.useMutation();
  // const onUpdateClick = () => {
  //   mutation.mutate({ profilePhotoUrl, coverPhotoUrl });
  // };
  const updateProfile = (url: string) => {
    mutation.mutate({ profilePhotoUrl: url });
  };
  const updateBanner = (url: string) => {
    mutation.mutate({ coverPhotoUrl: url });
  };

  const profile = "profile";
  const banner = "banner";

  return (
    <dialog id="my_modal_3" className="modal">
      <div className="pl-100 modal-box  w-11/12 max-w-3xl">
        <div className="modal-action">
          <form method="dialog">
            <button
              className="modal-action absolute right-0 top-0 m-6"
              data-micromodal-close
            >
              &times;
            </button>
          </form>
        </div>
        <h3 className="text-center text-lg font-bold">Update Your Photos:</h3>
        <div className="flex justify-center pl-3">
          <div>
            <div className="pt-4">
              <label> Profile Photo URL: </label>
              <UploadFiles
                profileId={profileId}
                tag={profile}
                update={updateProfile}
              />
            </div>
            <div className="pt-4">
              <label> Banner Photo URL: </label>
              <UploadFiles
                profileId={profileId}
                tag={banner}
                update={updateBanner}
              />
            </div>
          </div>

          {/* </div> */}
          {/* <div>
            <label> Banner Photo URL: </label>
            <UploadFiles />
          </div> */}
          {/* show the files as they're uploaded */}

          {/* <form>
            <label> Profile Photo URL: </label>
            <div>
              <input
                type="text"
                value={profilePhotoUrl}
                className="h-10 w-96"
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
                className="h-10 w-96"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCoverPhotoUrl(e.target.value)
                }
              />
            </div>
            <button
              className="btn mt-6 bg-primary px-3 text-white"
              onClick={() => onUpdateClick()}
            >
              Update Photos
            </button>
          </form> */}
        </div>
      </div>
    </dialog>
  );
}
