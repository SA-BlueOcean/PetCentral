import { api } from "@/utils/api";
import { useState } from "react";

export default function EditPets({ petId }: { petId: string }) {
  return (
    <dialog id="my_modal_7" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm absolute right-5 top-5">&times;</button>
        </form>
        <p>Edit Your Pet's Information</p>
        <form>
          <label>First Name</label>
          <input type="text" required />
          <label>Date of Birth</label>
          <input type="date" required />
          <label>Breed</label>
          <select>
            <option></option>
          </select>
        </form>
      </div>
    </dialog>
  );
}
