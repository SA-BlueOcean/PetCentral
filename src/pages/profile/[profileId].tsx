import { api } from "@/utils/api";
import { Example } from "@/components/Example";
// import { GetServerSideProps } from "next";
import { PenSquare } from "lucide-react";
import { useRouter } from "next/router";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import EditProfileModal from "@/components/Profile/EditProfileModal";
import Feed from "@/components/Feed";
import { useSession } from "next-auth/react";
// import { Square } from "lucide-react";

export default function ProfilePage() {
  const hello = api.example.hello.useQuery({ text: "example hi" });

  // need to get user data
  const router = useRouter();

  const profileId = router.query.profileId as string;
  const user = api.profile.get.useQuery(
    { profileId },
    { enabled: !!profileId },
  );

  const session = useSession();

  return (
    <>
      <ProfileHeader profileId={profileId} />
      <EditProfileModal profileId={profileId} />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b ">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"></div>
          <p className="text-2xl ">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
          <Example />
          <Feed mode="PROFILE" />
        </div>
      </main>
    </>
  );
}
