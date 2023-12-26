import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import { api } from "@/utils/api";
import { Example } from "@/components/Example";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import EditProfileModal from "@/components/Profile/EditProfileModal";

export default function ProfilePage() {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const hello = api.example.hello.useQuery({ text: "example hi" });

  const router = useRouter();

  const profileId = router.query.profile;

  const showProfileModalHandler = () => {
    setShowProfileModal(!showProfileModal);
  };

  return (
    <>
      <ProfileHeader />
      <button
        className="btn"
        onClick={() =>
          (
            document.getElementById("my_modal_4") as HTMLDialogElement | null
          )?.showModal?.()
        }
      >
        open modal
      </button>
      <EditProfileModal />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b ">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight  sm:text-[5rem]">
            Group page group {profileId}
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"></div>
          <p className="text-2xl ">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
          <Example />
        </div>
      </main>
    </>
  );
}
