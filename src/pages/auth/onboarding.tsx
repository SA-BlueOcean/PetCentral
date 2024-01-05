import { api } from "@/utils/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import AddPersonalInfo from "@/components/Onboarding/AddPersonalInfo";
import AddBio from "@/components/Onboarding/AddBio";
import AddPets from "@/components/Onboarding/AddPets";
import Head from "next/head";

export default function Onboarding() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const infoMutation = api.profile.updateInfo.useMutation();
  const [step, setStep] = useState(1);
  const personalInfo = {
    firstName: "",
    lastName: "",
    about: "",
    zipCode: "",
  };

  useEffect(() => {
    const checkSession = async () => {
      if (status === "unauthenticated") {
        await router.push("/").catch(console.error);
      }
    };
    checkSession().catch(console.error);
  }, [sessionData]);

  const updateInfo = (firstName: string, lastName: string, zipCode: string) => {
    personalInfo.firstName = firstName;
    personalInfo.lastName = lastName;
    personalInfo.zipCode = zipCode;
    setStep(2);
    document.getElementById("stepTwo")?.classList.add("step-primary");
  };

  const updateBio = (bio: string) => {
    personalInfo.about = bio ?? "";
    infoMutation.mutate(personalInfo);
    setStep(3);
    document.getElementById("stepThree")?.classList.add("step-primary");
  };

  return (
    <>
      <Head>
        <title>Pet Pals | Welcome</title>
        <meta name="description" content="App description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ul className="steps w-full">
        <li className="step step-neutral step-primary">Add Personal Info</li>
        <li id="stepTwo" className="step step-neutral">
          Add Bio
        </li>
        <li id="stepThree" className="step step-neutral">
          Add Pets
        </li>
      </ul>
      {step === 1 && <AddPersonalInfo updateInfo={updateInfo} />}
      {step === 2 && <AddBio updateBio={updateBio} />}
      {step === 3 && (
        <div>
          <AddPets profileId={sessionData?.user.id ?? "profileId"} />
        </div>
      )}
    </>
  );
}
