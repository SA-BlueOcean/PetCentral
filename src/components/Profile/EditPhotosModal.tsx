import { useState } from "react";
import { api } from "@/utils/api";
import UploadFiles from "@/components/Profile/UploadFile";

export default function EditPhotosModal({ profileId }: { profileId: string }) {
  // setup mutations for updating photos at Profile ID
  const mutation = api.profile.updatePhotos.useMutation();
  const updateProfile = (url: string) => {
    mutation.mutate({ profilePhotoUrl: url });
  };
  const updateBanner = (url: string) => {
    mutation.mutate(
      { bannerPhotoUrl: url },

      // { onSuccess: () => window.location.reload() },
    );
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
        </div>
      </div>
    </dialog>
  );
}
