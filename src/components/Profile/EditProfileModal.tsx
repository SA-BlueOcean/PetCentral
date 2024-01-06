import { api } from "@/utils/api";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function EditProfileModal() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [about, setAbout] = useState("");
  const [zip, setZip] = useState("");

  // setup mutations for updating profile at Profile ID
  const mutation = api.profile.updateInfo.useMutation();

  const close = () => {
    const modalElement = document.getElementById("my_modal_4");
    if (modalElement instanceof HTMLDialogElement) {
      modalElement.close();
    }
  };
  const utils = api.useUtils();
  const session = useSession();

  const onUpdateClick = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(
      { firstName, lastName, about, zip },
      {
        onSuccess() {
          utils.profile.get
            .invalidate({ profileId: session.data?.user?.id })
            .catch((err) => console.log(err));
        },
      },
    );
    setFirstName("");
    setLastName("");
    setAbout("");
    setZip("");
    close();
  };

  return (
    <dialog id="my_modal_4" className="modal">
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
        <h3 className="text-center text-lg font-bold">Edit Your Profile:</h3>
        <div className="flex justify-center pl-3">
          <form onSubmit={(e) => onUpdateClick(e)}>
            <label> First Name: </label>
            <div>
              <input
                type="text"
                className="h-10 w-96"
                value={firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFirstName(e.target.value)
                }
              />
            </div>
            <label> Last Name: </label>
            <div>
              <input
                type="text"
                value={lastName}
                className="h-10 w-96"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLastName(e.target.value)
                }
              />
            </div>
            <label> About: </label>
            <div>
              <textarea
                value={about}
                className="h-40 w-96"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setAbout(e.target.value)
                }
              ></textarea>
            </div>
            <label> Zip: </label>
            <div>
              <input
                type="text"
                value={zip}
                className="h-10 w-96"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setZip(e.target.value)
                }
              />
            </div>
            <button
              disabled={mutation.isLoading}
              className="btn mt-6 bg-primary px-3 text-white"
            >
              {mutation.isLoading ? (
                <Loader size={12} className="animate-spin" />
              ) : (
                ""
              )}
              UPDATE INFORMATION
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
