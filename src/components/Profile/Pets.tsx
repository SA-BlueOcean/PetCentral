import { api } from "@/utils/api";
import { Loader, PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import EditPets from "./EditPets";
import PetCard from "./PetCard";

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

  const user = api.profile.get.useQuery(
    { profileId },
    { enabled: !!profileId },
  );
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
    <div className="my-10 px-3">
      <div className="flex justify-between">
        <p className="text-xl font-bold">My Pets</p>
        {session.data?.user?.id === profileId ? (
          <button
            className="hover:text-accent"
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
      {user.isLoading ? (
        <div className="flex justify-center">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-neutral-400">
          {pets?.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              profileId={profileId}
              handleEditPet={handleEditPet}
            />
          ))}
        </div>
      )}
      <EditPets pet={currPet} animalId={animalId} profileId={profileId} />
    </div>
  );
}
