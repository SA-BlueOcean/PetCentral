import { api } from "@/utils/api";
import { HTMLInputTypeAttribute, useState } from "react";

export default function EditProfileModal({ profileId }: { profileId: string }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [about, setAbout] = useState("");
  const [zip, setZip] = useState("");

  return (
    <dialog id="my_modal_4" className="modal">
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
        <h3 className="text-center text-lg font-bold">Edit Your Profile:</h3>
        <div className="flex justify-center pl-3">
          <form>
            <label> First Name: </label>
            <div>
              <input
                type="text"
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLastName(e.target.value)
                }
              />
            </div>
            <label> About: </label>
            <div>
              <textarea
                value={about}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setZip(e.target.value)
                }
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
