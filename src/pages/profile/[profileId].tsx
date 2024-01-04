import { useRouter } from "next/router";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import EditProfileModal from "@/components/Profile/EditProfileModal";
import EditProfilePhotoModal from "@/components/Profile/EditProfilePhotoModal";
import Feed from "@/components/Feed";
import Bio from "@/components/Profile/Bio";
import EditPhotosModal from "@/components/Profile/EditPhotosModal";
import Pets from "@/components/Profile/Pets";
import AddPets from "@/components/Profile/AddPets";
import { api } from "@/utils/api";

export default function ProfilePage() {
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
      <EditProfilePhotoModal profileId={profileId} />
      <EditProfileModal profileId={profileId} />
      <AddPets profileId={profileId} />
      <Bio profileId={profileId} />
      <Pets profileId={profileId} />
      <Feed mode="PROFILE" profileId={profileId} />
    </>
  );
}
