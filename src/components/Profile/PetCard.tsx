import { api } from "@/utils/api";
import { PenSquare } from "lucide-react";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

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

export default function PetCard({
  pet,
  profileId,
  handleEditPet,
}: {
  pet: Pet;
  profileId: string;
  handleEditPet: (pet: Pet, animalId: number) => void;
}) {
  const mutation = api.pets.removePet.useMutation();
  const utils = api.useUtils();

  const handleDelete = () => {
    mutation.mutate(
      { petId: pet.id },
      {
        onSuccess() {
          utils.profile.get.invalidate({ profileId }).catch((err) => {
            console.log(err);
          });
        },
      },
    );
  };

  const capitalize = (s: string | undefined) =>
    s ? s?.[0]?.toUpperCase() + s.slice(1) : "";
  const currentDate = new Date();
  const birthdate = new Date(pet?.dateOfBirth ?? new Date());
  const ageInMilliseconds = currentDate.getTime() - birthdate.getTime();
  const ageInYears = currentDate.getFullYear() - birthdate.getFullYear();
  const ageDisplay =
    ageInMilliseconds < 0
      ? "<1 year"
      : ageInYears > 1
        ? `${ageInYears} ${ageInYears === 1 ? "year" : "years"}`
        : "<1 year";

  const session = useSession();

  return (
    <div className="flex gap-x-3 py-4">
      <div className="relative size-20 flex-none overflow-clip rounded-lg border border-neutral-400">
        <Image
          src={
            pet?.photoUrl
              ? pet?.photoUrl
              : "https://static.vecteezy.com/system/resources/previews/012/049/155/original/isolated-dog-animal-silhouette-icon-simple-black-shape-graphic-symbol-illustration-abstract-design-element-vet-clinic-logo-pet-portrait-shadow-flat-style-vector.jpg"
          }
          alt={pet?.firstName ?? ""}
          unoptimized
          fill
          className="object-cover"
        ></Image>
      </div>
      <div className="flex w-full flex-col justify-between py-3">
        <div className="flex justify-between">
          <p className="text-lg font-semibold">
            {capitalize(pet?.firstName ?? "")}
          </p>
          {session.data?.user?.id === profileId ? (
            <div className="flex gap-x-2">
              <button
                className="hover:text-accent"
                onClick={() => {
                  handleEditPet(pet, pet?.breed?.animalId ?? 0);
                }}
              >
                <PenSquare size={18} strokeWidth={1.25} absoluteStrokeWidth />
              </button>
              <button className="hover:text-error" onClick={handleDelete}>
                <Trash2 size={20} strokeWidth={1.25} absoluteStrokeWidth />
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="flex gap-x-3">
          <p>{ageDisplay}</p>|
          <p>{capitalize(pet?.breed?.animal?.name ?? "")}</p>|
          <p>{capitalize(pet?.breed?.name ?? "")}</p>
        </div>
      </div>
    </div>
  );
}
