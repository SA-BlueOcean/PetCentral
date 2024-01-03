import Image from "next/image";

interface Pet {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  animalId: number;
  breedId: number;
  photoUrl: string;
}

export default function PetCard({ pet }: { pet: Pet }) {
  return (
    <div>
      <Image
        src={pet.photoUrl ?? "https://clipart-library.com/images/BiaEg4n8T.jpg"}
        width={50}
        height={50}
      ></Image>
      <p>{pet?.firstName}</p>
    </div>
  );
}
