import { api } from "@/utils/api";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function Onboarding() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const mutation = api.auth.editUser.useMutation();

  useEffect(() => {
    const checkSession = async () => {
      if (status === "unauthenticated") {
        await router.push("/").catch(console.error);
      }
    };
    checkSession().catch(console.error);
  }, [sessionData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      zipCode: formData.get("zipCode") as string,
    };

    mutation.mutate(data, {
      onSuccess() {
        router.push(`/profile/${sessionData?.user.id}`).catch(console.error);
      },
    });
  };

  return (
    <>
      <Head>
        <title>Pet Pals | Welcome</title>
        <meta name="description" content="App description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="card mx-auto my-10 flex w-96 bg-neutral text-neutral-content">
        <div className="card-body  text-center">
          <h2 className="card-title"></h2>
          <form onSubmit={handleSubmit}>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">First Name:</span>
              </div>
              <input
                type="text"
                placeholder="Olive"
                name="firstName"
                className="input input-bordered w-full max-w-xs"
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Last Name:</span>
              </div>
              <input
                type="text"
                placeholder="Maipetz"
                name="lastName"
                className="input input-bordered w-full max-w-xs"
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Zipcode:</span>
              </div>
              <input
                type="text"
                placeholder="12345"
                name="zipCode"
                className="input input-bordered w-full max-w-xs"
              />
            </label>
            <div className="card-actions justify-end">
              <button className="btn btn-primary mt-2" type="submit">
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
