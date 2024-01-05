import { api } from "@/utils/api";
import { useEffect, useState } from "react";

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
  const [photoUrl, setPhotoUrl] = useState(pet?.photoUrl);

  useEffect(() => {
    setFirstName(pet?.firstName);
    setDOB(pet?.dateOfBirth?.toISOString().split("T")[0]);
    setBreedId(pet?.breedId);
    setPhotoUrl(pet?.photoUrl);
  }, [pet]);

  const breedQuery = api.pets.getBreeds.useQuery({ animalId });

  const resetFields = () => {
    setFirstName(pet?.firstName);
    setDOB(pet?.dateOfBirth?.toISOString().split("T")[0]);
    setBreedId(pet?.breedId);
    setPhotoUrl(pet?.photoUrl);
  };

  const mutation = api.pets.updatePet.useMutation();
  const utils = api.useUtils();
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(
      {
        petId: pet?.id ?? "",
        firstName: firstName ?? pet?.firstName ?? "",
        dateOfBirth: new Date(Date.parse(dateOfBirth ?? "")),
        breedId: breedId ?? pet?.breedId ?? 0,
        photoUrl: photoUrl ?? "",
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
          className="mx-20 my-5 flex flex-col gap-y-3"
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
          <label>Upload A New Photo</label>
          <input
            type="text"
            value={photoUrl ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPhotoUrl(e.target.value)
            }
          />
          <button type="button">Upload</button>
          <button
            type="submit"
            className="btn btn-outline btn-success btn-wide w-full"
          >
            Update
          </button>
        </form>
      </div>
    </dialog>
  );
}
