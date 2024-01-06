import Feed from "@/components/Feed";
import AddPets from "@/components/Profile/AddPets";
import Bio from "@/components/Profile/Bio";
import EditPhotosModal from "@/components/Profile/EditPhotosModal";
import EditProfileModal from "@/components/Profile/EditProfileModal";
import EditProfilePhotoModal from "@/components/Profile/EditProfilePhotoModal";
import Pets from "@/components/Profile/Pets";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();
  const profileId = router.query.profileId as string;

  return (
    <>
      <ProfileHeader profileId={profileId} />
      <EditPhotosModal profileId={profileId} />
      <EditProfilePhotoModal profileId={profileId} />
      <EditProfileModal />
      <Bio profileId={profileId} />
      <Pets profileId={profileId} />
      <AddPets profileId={profileId} />
      <Feed mode="PROFILE" profileId={profileId} />
    </>
  );
}
