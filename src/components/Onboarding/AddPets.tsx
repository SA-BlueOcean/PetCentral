import { api } from "@/utils/api";
import { useState } from "react";
import { supabase } from "lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/env.js";
import { useRouter } from "next/router";

export default function AddPets({ profileId }: { profileId: string }) {
  type Breed = {
    id: number;
    name: string;
  };

  const animalQuery = api.pets.getAnimals.useQuery().data?.animals;
  const [firstName, setFirstName] = useState("");
  const [dateOfBirth, setDOB] = useState("mm/dd/yyyy");
  const [animalId, setAnimalId] = useState(0);
  const [breeds, setBreeds] = useState([] as Breed[]);
  const [breedId, setBreedId] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const resetFields = () => {
    setFirstName("");
    setDOB("mm/dd/yyyy");
    setAnimalId(0);
    setBreeds([] as Breed[]);
    setBreedId(0);
  };

  const mutation = api.pets.addPet.useMutation();
  const utils = api.useUtils();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        firstName,
        dateOfBirth: new Date(Date.parse(dateOfBirth ?? "")),
        breedId,
        photoUrl: address,
      },
      {
        onSuccess: () => {
          utils.profile.get.invalidate({ profileId }).catch((err) => {
            console.log(err);
          });
          (
            document.getElementById("my_modal_6") as HTMLDialogElement | null
          )?.close?.();
          resetFields();
        },
      },
    );
  };

  return (
    <div className="card mx-auto my-10 flex w-96 bg-neutral text-neutral-content">
      <div className="card-body  text-center">
        <h2 className="card-title"></h2>
        <form onSubmit={handleSubmit}>
          <label className="form-control w-full max-w-xs">Add Your pet!</label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">First Name</span>
            </div>
            <input
              type="text"
              value={firstName}
              className="input input-bordered input-md w-full max-w-xs"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFirstName(e.target.value)
              }
              required
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
              required
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Animal</span>
            </div>
            <select
              className="select select-bordered select-md w-full max-w-xs"
              value={animalId}
              required
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const selectedAnimalId = parseInt(e.target.value, 10);
                setAnimalId(selectedAnimalId);
                setBreeds(
                  animalQuery?.find((animal) => animal.id === selectedAnimalId)
                    ?.breeds ?? [],
                );
              }}
            >
              <option value={0}>Select one</option>
              {animalQuery?.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name}
                </option>
              ))}
            </select>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Breed</span>
            </div>
            <select
              className="select select-bordered select-md w-full max-w-xs"
              value={breedId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setBreedId(parseInt(e.target.value, 10))
              }
            >
              <option value={0}>Select Breed</option>
              {breeds.map((breed) => (
                <option key={breed.id} value={breed.id}>
                  {breed.name}
                </option>
              ))}
            </select>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Upload A Picture of Your Pet</span>
            </div>
            <input
              type="file"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFile(e.target.files?.[0] ?? null);
              }}
              className="file-input-neutral file-input file-input-bordered file-input-sm w-full max-w-xs hover:file-input-secondary"
            />
          </label>
          <button
            type="submit"
            className="btn btn-outline btn-success mt-4 w-full"
          >
            Add Pet
          </button>
          <div className="card-actions justify-end"></div>
        </form>

        <button
          className="btn btn-primary mt-2"
          onClick={() => router.push(`/profile/${profileId}`)}
        >
          Done Adding Pets
        </button>
      </div>
    </div>
  );
}
