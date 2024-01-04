import Image from "next/image";

interface Pet {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  animalId: number;
  breedId: number;
  photoUrl: string;
}

export default function PetCard({ pet }: { pet: Pet }) {
  const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);
  const currentDate = new Date();
  const birthdate = new Date(pet?.dateOfBirth);
  const ageInMilliseconds = currentDate.getTime() - birthdate.getTime();
  const ageInYears = currentDate.getFullYear() - birthdate.getFullYear();

  const ageDisplay =
    ageInMilliseconds < 0
      ? "<1 year"
      : ageInYears > 1
        ? `${ageInYears} ${ageInYears === 1 ? "year" : "years"}`
        : "<1 year";

  return (
    <div>
      <Image
        src={
          pet?.photoUrl
            ? pet?.photoUrl
            : "https://ph-files.imgix.net/75c2cda9-e2c3-4bcd-a0b1-0595daba1844.png?auto=format&fit=crop://clipart-library.com/images/BiaEg4n8T.jpg"
        }
        alt={pet.firstName}
        width={75}
        height={75}
        unoptimized
      ></Image>
      <p>{capitalize(pet?.firstName)}</p>
      <p>{ageDisplay}</p>
    </div>
  );
}
