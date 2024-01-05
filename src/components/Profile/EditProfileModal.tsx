import { api } from "@/utils/api";
import { disconnect } from "process";
import { useState } from "react";
import { Loader } from "lucide-react";

export default function EditProfileModal() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [about, setAbout] = useState("");
  const [zip, setZip] = useState("");

  // setup mutations for updating profile at Profile ID
  const mutation = api.profile.updateInfo.useMutation();
  const onUpdateClick = () => {
    mutation.mutate({ firstName, lastName, about, zip });
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
          <form>
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
              onClick={() => onUpdateClick()}
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
