import { api } from "@/utils/api";
import { Trash2 } from "lucide-react";
import Image from "next/image";

interface Pet {
  id: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: Date | null;
  breedId: number | null;
  photoUrl: string | null;
}

export default function PetCard({
  pet,
  profileId,
}: {
  pet: Pet;
  profileId: string;
}) {
  const breed = api.pets.getSpecificBreed.useQuery({
    breedId: pet?.breedId ?? 0,
  }).data;

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

  return (
    <div className="flex">
      <Image
        src={
          pet?.photoUrl
            ? pet?.photoUrl
            : "https://static.vecteezy.com/system/resources/previews/012/049/155/original/isolated-dog-animal-silhouette-icon-simple-black-shape-graphic-symbol-illustration-abstract-design-element-vet-clinic-logo-pet-portrait-shadow-flat-style-vector.jpg"
        }
        alt={pet?.firstName ?? ""}
        width={75}
        height={75}
        unoptimized
      ></Image>
      <div className="flex flex-col justify-between">
        <p>{capitalize(pet?.firstName ?? "")}</p>
        <div className="flex gap-x-12">
          <p>{ageDisplay}</p>
          <p>{capitalize(breed?.animal?.name ?? "")}</p>
          <p>{capitalize(breed?.name ?? "")}</p>
        </div>
      </div>
      <button onClick={handleDelete}>
        <Trash2 size={20} strokeWidth={1.25} absoluteStrokeWidth />
      </button>
    </div>
  );
}
