// import { api } from "@/utils/api";
import { useState } from "react";

const EditProfileModal = () => {
  const [state, setState] = useState("");
  const states = [
    "",
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];
  return (
    <dialog id="my_modal_4" className="modal">
      <div className="modal-box w-11/12 max-w-3xl">
        <h3 className="text-lg font-bold">Edit Profile: </h3>
        <form>
          <div>
            <label> First Name: </label>
            <input type="text" placeholder="user data" />
          </div>
          <div>
            <label> Last Name: </label>
            <input type="text" placeholder="user data" />
          </div>
          <div>
            <label> About: </label>
            <input type="text" placeholder="user data"></input>
          </div>
          <div>
            <label> City: </label>
            <input type="text" placeholder="user data" />
          </div>
          <div>
            <select
              value={state}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setState(e.target.value)
              }
            >
              {states.map((state) => (
                <option>{state}</option>
              ))}
            </select>
          </div>
        </form>
        <p className="py-4">Click the button below to close</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default EditProfileModal;
