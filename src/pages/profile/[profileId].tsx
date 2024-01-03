import { api } from "@/utils/api";
import { Example } from "@/components/Example";
import { useRouter } from "next/router";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import EditProfileModal from "@/components/Profile/EditProfileModal";
import Feed from "@/components/Feed";
import EditPhotosModal from "@/components/Profile/EditPhotosModal";
import Pets from "@/components/Profile/Pets";
import AddPets from "@/components/Profile/AddPets";

export default function ProfilePage() {
  // const hello = api.example.hello.useQuery({ text: "example hi" });

  // need to get user data
  const router = useRouter();

  const profileId = router.query.profileId as string;

  return (
    <>
      <ProfileHeader profileId={profileId} />
      <EditPhotosModal profileId={profileId} />
      <EditProfileModal profileId={profileId} />
      <Pets profileId={profileId} />
      <AddPets profileId={profileId} />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b ">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"></div>
          {/* <p className="text-2xl ">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p> */}
          <Example />
          <Feed mode="PROFILE" profileId={profileId} />
        </div>
      </main>
    </>
  );
}
