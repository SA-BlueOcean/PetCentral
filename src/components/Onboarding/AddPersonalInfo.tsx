import { useState } from "react";

export default function PersonalInfo({
  updateInfo,
}: {
  updateInfo: (firstName: string, lastName: string, zipCode: string) => void;
}) {
  const [validFirstName, setValidFirstName] = useState(true);
  const [validLastName, setValidLastName] = useState(true);
  const [validZipCode, setValidZipCode] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!firstName) {
      setValidFirstName(false);
      valid = false;
    } else setValidFirstName(true);
    if (!lastName) {
      setValidLastName(false);
      valid = false;
    } else setValidLastName(true);
    if (zipCode.length !== 5 || /[^0-9]/.test(zipCode)) {
      setValidZipCode(false);
      valid = false;
    } else setValidZipCode(true);

    if (!valid) return;

    updateInfo(firstName, lastName, zipCode);
  };

  return (
    <div className="card mx-auto my-10 flex w-96 bg-neutral text-neutral-content">
      <div className="card-body  text-center">
        <h2 className="card-title"></h2>
        <form onSubmit={handleSubmit}>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">First Name:</span>
            </div>
            {validFirstName ? (
              <input
                type="text"
                placeholder="Olive"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input input-bordered w-full max-w-xs"
              />
            ) : (
              <div
                className="tooltip tooltip-right tooltip-open tooltip-error"
                data-tip="Please add your first name"
              >
                <input
                  type="text"
                  placeholder="Olive"
                  name="firstName"
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
            )}
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Last Name:</span>
            </div>
            {validLastName ? (
              <input
                type="text"
                placeholder="Maipetz"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input input-bordered w-full max-w-xs"
              />
            ) : (
              <div
                className="tooltip tooltip-right tooltip-open tooltip-error"
                data-tip="Please add your last name"
              >
                <input
                  type="text"
                  placeholder="Maipetz"
                  name="lastName"
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
            )}
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Zipcode:</span>
            </div>
            {validZipCode ? (
              <input
                type="text"
                placeholder="12345"
                name="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="input input-bordered w-full max-w-xs"
              />
            ) : (
              <div
                className="tooltip tooltip-right tooltip-open tooltip-error"
                data-tip="Please add a valid zipcode"
              >
                <input
                  type="text"
                  placeholder="12345"
                  name="zipCode"
                  onChange={(e) => setZipCode(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
            )}
          </label>
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
