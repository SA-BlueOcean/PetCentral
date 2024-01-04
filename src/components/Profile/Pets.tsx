import { api } from "@/utils/api";
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import PetCard from "./PetCard";
import { useState } from "react";
import EditPets from "./EditPets";

export default function Pets({ profileId }: { profileId: string }) {
  type Pet = {
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
  };

  const pets = api.profile.get.useQuery({ profileId }).data?.pets;

  const [currPet, setCurrPet] = useState<Pet | null>(null);
  const [animalId, setAnimalId] = useState(0);
  const handleEditPet = (pet: Pet, animalId: number) => {
    setCurrPet(pet);
    setAnimalId(animalId);
    (
      document.getElementById("my_modal_7") as HTMLDialogElement | null
    )?.showModal?.();
  };

  const session = useSession();

  return (
    <div className="mt-10">
      <div className="flex justify-between">
        <p className="text-xl font-semibold">My Pets</p>
        {session.data?.user?.id === profileId ? (
          <button
            onClick={() =>
              (
                document.getElementById(
                  "my_modal_6",
                ) as HTMLDialogElement | null
              )?.showModal?.()
            }
          >
            <PlusCircle size={24} strokeWidth={1.25} absoluteStrokeWidth />
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col gap-y-10">
        {pets?.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            profileId={profileId}
            handleEditPet={handleEditPet}
          />
        ))}
      </div>
      <EditPets pet={currPet} animalId={animalId} profileId={profileId} />
    </div>
  );
}
