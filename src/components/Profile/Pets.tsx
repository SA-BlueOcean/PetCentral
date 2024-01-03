import { PlusCircle } from "lucide-react";

export default function Pets({ profileId }: { profileId: string }) {
  return (
    <div className="mt-10">
      <div className="flex justify-between">
        <p className="text-xl font-semibold">My Pets</p>
        <button
          onClick={() =>
            (
              document.getElementById("my_modal_5") as HTMLDialogElement | null
            )?.showModal?.()
          }
        >
          <PlusCircle size={24} strokeWidth={1.25} absoluteStrokeWidth />
        </button>
      </div>
    </div>
  );
}
