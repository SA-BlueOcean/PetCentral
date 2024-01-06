import UploadFiles from "@/components/Profile/UploadFile";
import { api } from "@/utils/api";

export default function EditPhotosModal({ profileId }: { profileId: string }) {
  const mutation = api.profile.updatePhotos.useMutation();

  const utils = api.useUtils();

  const updateBanner = (url: string) => {
    mutation.mutate(
      { bannerPhotoUrl: url },
      {
        onSuccess() {
          utils.profile.get
            .invalidate({ profileId })
            .catch((err) => console.log(err));
        },
      },
    );
  };

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
        <h3 className="text-center text-lg font-bold">
          Update Your Banner Photo:
        </h3>
        <div className="flex justify-center pl-3">
          <div>
            <div className="pt-4">
              <label> Banner Photo URL: </label>
              <UploadFiles update={updateBanner} />
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
