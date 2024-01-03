import { api } from "@/utils/api";
// import { Example } from "@/components/Example";
import { useRouter } from "next/router";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import EditProfileModal from "@/components/Profile/EditProfileModal";
import Feed from "@/components/Feed";
import EditPhotosModal from "@/components/Profile/EditPhotosModal";

export default function ProfilePage() {
  // const hello = api.example.hello.useQuery({ text: "example hi" });

  // need to get user data
  const router = useRouter();

  const profileId = router.query.profileId as string;
  const user = api.profile.get.useQuery(
    { profileId },
    { enabled: !!profileId },
  );

  return (
    <>
      <ProfileHeader profileId={profileId} />
      <EditPhotosModal profileId={profileId} />
      <EditProfileModal profileId={profileId} />
      <Feed mode="PROFILE" profileId={profileId} />
    </>
  );
}
