import { Check, X, PawPrint } from "lucide-react";
import Image from "next/image";
import { api } from "@/utils/api";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { setTimeout } from "timers";
import useAddFriend from "@/components/Profile/useAddFriend";

//const utils = api.useUtils();

export default function FindFriendsPage() {
  const [distance, setDistance] = useState(50);
  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState([]);
  const [hide, setHide] = useState([]);

  const { data: sessionData, status } = useSession();
  const { addFriend } = useAddFriend();

  const handleNext = (dir: string) => {
    if (users.data[users.data?.length - current - 1] !== undefined) {
      if (dir === "right") {
        addFriend(users.data[users.data?.length - current - 1].id).catch(
          (err) => {
            console.error(err);
          },
        );
      }
      const newAnimate = [...animate];
      newAnimate[current] = dir;
      setAnimate(newAnimate);
      const newHide = [...hide];
      newHide[current] = true;
      setCurrent((current) => current + 1);
      setTimeout(() => {
        setHide(newHide);
      }, 300);
    }
  };

  const handleDistance = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDistance(Number(e.target.value));
  };

  const errorHandle = (err: unknown) => {
    console.log("THERE IS AN ErRRoR", err);
  };
  const users = api.friends.findFriends.useQuery(
    { distance: distance },
    { onError: errorHandle, enabled: status === "authenticated" },
  );

  console.log(users.data);

  return (
    <div className="flex w-full flex-col  justify-center gap-3">
      <h1 className="text-center text-lg font-semibold">Find Some Friends</h1>
      <h2 className="text-center">{users.data?.length} Possible new friends</h2>
      <section className="flex w-full items-center justify-between ">
        <button
          onClick={() => {
            handleNext("left");
          }}
          className="btn btn-circle btn-error h-16 w-16 "
        >
          <X className="h-16 w-16 text-base-100" />
        </button>
        <div className="relative h-[464px] w-[400px]">
          <p className="mt-48 text-center text-base-500">
            Change filter to find more friends
          </p>

          {users.isLoading ? (
            <ProfileCard
              key={"sdfaljasdfl"}
              fly={null}
              hide={null}
              loading={true}
              user={{
                name: "Loading Friends",
                id: "aafadsffd",
                profilePhotoUrl: null,
                location: { locationName: null },
                pets: [],
              }}
            />
          ) : (
            users.data?.map((user, index) => {
              return (
                <ProfileCard
                  key={user.id}
                  fly={animate[users.data.length - index - 1]}
                  hide={hide[users.data.length - index - 1]}
                  user={user}
                  loading={false}
                />
              );
            })
          )}
        </div>

        <button className="btn btn-circle btn-success h-16 w-16">
          <Check
            onClick={() => {
              handleNext("right");
            }}
            className="h-16 w-16 text-base-100"
          />
        </button>
      </section>
      <section className="w-full p-8">
        <h2 className="text-center">Filter Friends</h2>
        <div className="mb-8">
          <div>
            <label htmlFor="distance">Friends within {distance} miles</label>
            <input
              onChange={handleDistance}
              type="range"
              min={0}
              max="100"
              value={distance}
              name="distance"
              className="range"
            />
          </div>
          {/* <button
            onClick={handleSearch}
            className="btn btn-primary btn-lg rounded-full text-base-100"
          >
            Search
          </button> */}
        </div>
        {/* <ul className="flex flex-wrap gap-3">
          <li className="flex gap-1">
            <input type="checkbox" name="dog" id="dog" className="checkbox" />
            <label htmlFor="dog" className="font-semibold">
              Dog
            </label>
          </li>
          <li className="flex gap-1">
            <input type="checkbox" name="Cat" id="Cat" className="checkbox" />
            <label htmlFor="Cat" className="font-semibold">
              Cat
            </label>
          </li>
          <li className="flex gap-1">
            <input type="checkbox" name="Fish" id="Fish" className="checkbox" />
            <label htmlFor="Fish" className="font-semibold">
              Fish
            </label>
          </li>

          <li className="flex gap-1">
            <input
              type="checkbox"
              name="Rabbit"
              id="Rabbit"
              className="checkbox"
            />
            <label htmlFor="Rabbit" className="font-semibold">
              Rabbit
            </label>
          </li>
          <li className="flex gap-1">
            <input
              type="checkbox"
              name="Other"
              id="Other"
              className="checkbox"
            />
            <label htmlFor="Other" className="font-semibold">
              Other
            </label>
          </li>

          <li className="flex gap-1">
            <input
              type="checkbox"
              name="Hamster"
              id="Hamster"
              className="checkbox"
            />
            <label htmlFor="Hamster" className="font-semibold">
              Hamster
            </label>
          </li>
        </ul> */}
      </section>
    </div>
  );
}

const ProfileCard = ({
  user,
  fly,
  hide,
  loading,
}: {
  user: {
    name: string | null;
    id: string;
    profilePhotoUrl: string | null;
    location: { locationName: string | null };
    pets: object[];
  };
  fly: string | null | undefined;
  hide: boolean | null;
  loading: boolean;
}) => {
  return (
    <div
      className={`card skeleton absolute left-0 top-0 h-[464px] w-[400px]
      ${fly === "left" ? "animate-flyL" : null} ${
        fly === "right" ? "animate-flyR" : null
      } ${hide ? "hidden" : null} overflow-hidden bg-base-500`}
    >
      <Image
        className="card-body h-[400px] w-[400px] object-cover p-0"
        src={user.profilePhotoUrl ? user.profilePhotoUrl : avatar}
        width={400}
        height={400}
        alt="profile picture"
      />
      <div className="card-title flex h-16 justify-between bg-base-100 p-3">
        <div className="ml-3 flex flex-col">
          <h2>
            {user.name}{" "}
            {loading ? (
              <span className="loading loading-dots loading-sm"></span>
            ) : null}
          </h2>
          <h3 className="text-sm font-normal text-base-600">
            {" "}
            {user.location?.locationName}
          </h3>
        </div>
        <div className="mr-3 flex gap-2">
          <PawPrint />
          <p className="font-normal">{user.pets.length}</p>
          <p className="font-normal">Pets</p>
        </div>
      </div>
    </div>
  );
};

const avatar =
  "data:image/jpeg;base64,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";
