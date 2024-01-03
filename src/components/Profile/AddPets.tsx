import { api } from "@/utils/api";
import { useState } from "react";

export default function AddPets({ profileId }: { profileId: string }) {
  const animalQuery = api.pets.getAnimals.useQuery();

  const [name, setName] = useState("");
  const [dob, setDOB] = useState(new Date().toISOString().split("T")[0]);
  const [animalId, setAnimalId] = useState(
    animalQuery.data?.animals?.[0].id as number,
  );

  const breedQuery = api.pets.getBreeds.useQuery({ animalId });

  const [filteredBreeds, setFilteredBreeds] = useState(breedQuery.data?.breeds);

  const resetFields = () => {
    setName("");
    setDOB(new Date().toISOString().split("T")[0]);
    setAnimalId(animalQuery.data?.animals?.[0].id as number);
  };

  return (
    <dialog id="my_modal_5" className="modal">
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
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            required
          />
          <label>Date of Birth</label>
          <input
            type="date"
            value={dob}
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
            {animalQuery.data?.animals?.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name}
              </option>
            ))}
          </select>
          <label>Breed</label>
          <select required>
            {filteredBreeds?.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </select>
        </form>
      </div>
    </dialog>
  );
}
