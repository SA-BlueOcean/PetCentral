import { api } from "@/utils/api";
import { useState } from "react";

export default function AddPets({ profileId }: { profileId: string }) {
  const animalQuery = api.pets.getAnimals.useQuery();

  const [firstName, setFirstName] = useState("");
  const [dateOfBirth, setDOB] = useState("mm/dd/yyyy");
  const [animalId, setAnimalId] = useState(0);

  const breedQuery = api.pets.getBreeds.useQuery({ animalId });

  const [breedId, setBreedId] = useState(0);
  const [photoUrl, setPhotoUrl] = useState("");

  const mutation = api.pets.addPet.useMutation();
  const handleSubmit = () => {
    mutation.mutate({
      firstName,
      dateOfBirth: new Date(Date.parse(dateOfBirth ?? "")),
      breedId,
      photoUrl,
    });
  };

  const resetFields = () => {
    setFirstName("");
    setDOB("mm/dd/yyyy");
    setAnimalId(0);
    setBreedId(0);
  };

  return (
    <dialog id="my_modal_6" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button
            className="btn btn-sm absolute right-5 top-5"
            onClick={resetFields}
          >
            &times;
          </button>
        </form>
        <p className="mt-5 text-center text-lg font-semibold">Add Your Pet</p>
        <form className="mx-20 my-5 flex flex-col">
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
            required
          />
          <label>Date of Birth</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDOB(e.target.value)
            }
            required
          />
          <label>Animal</label>
          <select
            required
            value={animalId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setAnimalId(parseInt(e.target.value, 10))
            }
          >
            <option value={0}>Select Animal</option>
            {animalQuery.data?.animals?.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name}
              </option>
            ))}
          </select>
          <label>Breed</label>
          <select
            required
            value={breedId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setBreedId(parseInt(e.target.value, 10))
            }
          >
            <option value={0}>Select Breed</option>
            {breedQuery.data?.breeds?.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </select>
          <label>Picture of Your Pet</label>
          <div className="flex justify-between">
            <input
              type="text"
              value={photoUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPhotoUrl(e.target.value)
              }
            />
            <button type="button">Upload Photo</button>
          </div>
          <button onClick={handleSubmit}>Add Pet</button>
        </form>
      </div>
    </dialog>
  );
}
