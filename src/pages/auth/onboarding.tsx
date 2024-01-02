import { api } from "@/utils/api";
import Head from "next/head";

export default function Onboarding() {
  const mutation = api.auth.editUser.useMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      zipCode: formData.get("zipCode") as string,
    };

    mutation.mutate(data);
  };

  return (
    <>
      <Head>
        <title>Pet Pals Sign In</title>
        <meta name="description" content="App description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
        <button className="btn btn-primary mt-2" type="submit">SUBMIT</button>
      </form>
    </>
  );
}
