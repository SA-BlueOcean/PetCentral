import { api } from "@/utils/api";
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import PetCard from "./PetCard";

export default function Pets({ profileId }: { profileId: string }) {
  const pets = api.profile.get.useQuery({ profileId }, { enabled: !!profileId })
    .data?.pets;

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
        {pets?.map((pet) => <PetCard key={pet.id} pet={pet} />)}
      </div>
    </div>
  );
}
