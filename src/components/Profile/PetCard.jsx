import Image from "next/image";

export default function PetCard({ pet }) {
  return (
    <div>
      <p>{pet?.firstName}</p>
    </div>
  );
}
