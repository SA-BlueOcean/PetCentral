import Head from "next/head";
import Link from "next/link";
import { Check, X, PawPrint } from "lucide-react";
import Image from "next/image";
import { api } from "@/utils/api";
import { useState } from "react";

export default function FindFriendsPage() {
  const [distance, setDistance] = useState(25);
  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(["false", "false", "false"]);

  const handleNext = (dir: string) => {
    setCurrent((current) => current + 1);
    console.log(current, dir);
  };

  const handleDistance = (e) => {
    setDistance(e.target.value);
  };

  const errorHandle = (err) => {
    console.log("error", err);
  };
  const users = api.friends.findFriends.useQuery(
    { distance: 10 },
    { onError: errorHandle },
  );

  console.log(users.data);

  return (
    <main className="flex w-full flex-col  justify-center gap-3">
      <h1 className="text-center text-lg font-semibold">Find Some Friends</h1>
      <h2 className="text-center">12 Possible new friends</h2>
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
          <ProfileCard index={2} fly={"false"} user={"Burhan Syed"} />
          <ProfileCard index={1} fly={"false"} user={"Clay Gibson"} />
          <ProfileCard index={0} fly={"false"} user={"Thomas Harbert"} />
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
    </main>
  );
}

const ProfileCard = ({ user, fly, index }) => {
  return (
    <div
      className={`card absolute left-0 top-0 h-[464px] w-[400px]
      ${fly === "left" ? "animate-flyL" : null} ${
        fly === "right" ? "animate-flyR" : null
      } overflow-hidden bg-base-500`}
    >
      <Image
        className="card-body"
        src="/afd"
        width={460}
        height={460}
        alt="profile picture"
      />
      <div className="card-title flex h-16 justify-between bg-base-100 p-3">
        <h2 className="ml-3">{user}</h2>
        <div className="mr-3 flex gap-2">
          <PawPrint />
          <p className="font-normal">2</p>
          <p className="font-normal">Pets</p>
        </div>
      </div>
    </div>
  );
};
