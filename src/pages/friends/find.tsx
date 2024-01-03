import { Check, X, PawPrint } from "lucide-react";
import Image from "next/image";
import { api } from "@/utils/api";
import { useState } from "react";
import Avatar from "@/components/Feed/Avatar";

// const { data: sessionData, status } = useSession();

// useEffect(() => {
//   const checkSession = async () => {
//     if (status === "unauthenticated") {
//       await router.push("/").catch(console.error);
//     }
//   };
//   checkSession().catch(console.error);
// }, [sessionData]);

export default function FindFriendsPage() {
  const [distance, setDistance] = useState(25);
  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(["false", "false", "false"]);

  const handleNext = (dir: string) => {
    const newAnimate = [...animate];
    newAnimate[current] = dir;
    setAnimate(newAnimate);
    setCurrent((current) => current + 1);
  };

  const handleDistance = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDistance(Number(e.target.value));
  };

  const errorHandle = (err: unknown) => {
    console.log("THERE IS AN ErRRoR", err);
  };
  const users = api.friends.findFriends.useQuery(
    { distance: 10 },
    { onError: errorHandle },
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

          {users.data?.map((user, index) => {
            return (
              <ProfileCard
                key={user.id}
                fly={animate[users.data.length - index - 1]}
                user={user}
              />
            );
          })}
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
        <div className="mb-8 flex justify-between gap-8">
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
          <button className="btn btn-primary btn-lg rounded-full text-base-100">
            Search
          </button>
        </div>
        <ul className="flex flex-wrap gap-3">
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
        </ul>
      </section>
    </div>
  );
}

const ProfileCard = ({
  user,
  fly,
}: {
  user: { name: string | null; id: string };
  fly: string | null | undefined;
}) => {
  return (
    <div
      className={`card absolute left-0 top-0 h-[464px] w-[400px]
      ${fly === "left" ? "animate-flyL" : null} ${
        fly === "right" ? "animate-flyR" : null
      } overflow-hidden bg-base-500`}
    >
      <Image
        className="card-body"
        src={`/dsafadsf`}
        width={460}
        height={460}
        alt="profile picture"
      />
      <div className="card-title flex h-16 justify-between bg-base-100 p-3">
        <h2 className="ml-3">{user.name}</h2>
        <div className="mr-3 flex gap-2">
          <PawPrint />
          <p className="font-normal">2</p>
          <p className="font-normal">Pets</p>
        </div>
      </div>
    </div>
  );
};
