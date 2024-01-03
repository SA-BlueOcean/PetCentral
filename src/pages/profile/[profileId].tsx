import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import EditProfileModal from "@/components/Profile/EditProfileModal";
import Feed from "@/components/Feed";
import EditPhotosModal from "@/components/Profile/EditPhotosModal";

export default function ProfilePage() {
  const router = useRouter();

  const profileId = router.query.profileId as string;

  return (
    <>
      <ProfileHeader profileId={profileId} />
      <EditPhotosModal profileId={profileId} />
      <EditProfileModal profileId={profileId} />
      <Feed mode="PROFILE" profileId={profileId} />
    </>
  );
}
