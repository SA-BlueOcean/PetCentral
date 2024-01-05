import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { supabase } from "lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/env.js";

interface Pet {
  id: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: Date | null;
  breedId: number | null;
  photoUrl: string | null;
  breed: {
    id: number;
    name: string;
    animalId: number;
    animal: {
      id: number;
      name: string;
    };
  };
}

export default function EditPets({
  pet,
  animalId,
  profileId,
}: {
  pet: Pet | null;
  animalId: number;
  profileId: string;
}) {
  const [firstName, setFirstName] = useState(pet?.firstName);
  const [dateOfBirth, setDOB] = useState(
    pet?.dateOfBirth?.toISOString().split("T")[0],
  );
  const [breedId, setBreedId] = useState(pet?.breedId);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setFirstName(pet?.firstName);
    setDOB(pet?.dateOfBirth?.toISOString().split("T")[0]);
    setBreedId(pet?.breedId);
  }, [pet]);

  const breedQuery = api.pets.getBreeds.useQuery({ animalId });

  const resetFields = () => {
    setFirstName(pet?.firstName);
    setDOB(pet?.dateOfBirth?.toISOString().split("T")[0]);
    setBreedId(pet?.breedId);
  };

  const mutation = api.pets.updatePet.useMutation();
  const utils = api.useUtils();
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      return;
    }
    const filename = `${uuidv4()}`;
    const address = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${filename}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: true,
      });
    mutation.mutate(
      {
        petId: pet?.id ?? "",
        firstName: firstName ?? pet?.firstName ?? "",
        dateOfBirth: new Date(Date.parse(dateOfBirth ?? "")),
        breedId: breedId ?? pet?.breedId ?? 0,
        photoUrl: address,
      },
      {
        onSuccess: () => {
          utils.profile.get.invalidate({ profileId }).catch((err) => {
            console.log(err);
          });
          (
            document.getElementById("my_modal_7") as HTMLDialogElement | null
          )?.close?.();
          resetFields();
        },
      },
    );
  };

  return (
    <dialog id="my_modal_7" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button
            className="btn btn-sm absolute right-5 top-5"
            onClick={resetFields}
          >
            &times;
          </button>
        </form>
        <p className="mt-5 text-center text-lg font-semibold">{`Edit ${pet?.firstName}'s Information`}</p>
        <form
          className="mx-20 my-5 flex flex-col gap-y-5"
          onSubmit={handleUpdate}
        >
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">First Name</span>
            </div>
            <input
              type="text"
              value={firstName ?? ""}
              className="input input-bordered input-md w-full max-w-xs"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFirstName(e.target.value)
              }
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Date of Birth</span>
            </div>
            <input
              type="date"
              value={dateOfBirth}
              className="input input-bordered input-md w-full max-w-xs"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDOB(e.target.value)
              }
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Breed</span>
            </div>
            <select
              className="select select-bordered select-md w-full max-w-xs"
              value={breedId ?? 0}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setBreedId(parseInt(e.target.value, 10))
              }
            >
              {breedQuery.data?.breeds?.map((breed) => (
                <option key={breed.id} value={breed.id}>
                  {breed.name}
                </option>
              ))}
            </select>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{`Update ${pet?.firstName}'s Picture`}</span>
            </div>
            <input
              type="file"
              name="image"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFile(e.target.files?.[0] ?? null);
              }}
              className="file-input-neutral file-input file-input-bordered file-input-sm w-full max-w-xs hover:file-input-secondary"
            />
          </label>
          <button type="submit" className="btn btn-outline btn-success w-full">
            Update
          </button>
        </form>
      </div>
    </dialog>
  );
}
