export default function AddBio({
  updateBio,
}: {
  updateBio: (bio: string) => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const bio = formData.get("bio") as string;
    updateBio(bio);
  };

  return (
    <div className="card mx-auto my-10 flex w-96 bg-neutral text-neutral-content">
      <div className="card-body  text-center">
        <h2 className="card-title"></h2>
        <form onSubmit={handleSubmit}>
          <label className="form-control w-full max-w-xs">
            Tell us about yourself!
          </label>
          <textarea
            className="textarea textarea-primary"
            name="bio"
            placeholder="Bio"
          ></textarea>
          <div className="card-actions justify-end">
            <button className="btn btn-primary mt-2" type="submit">
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
