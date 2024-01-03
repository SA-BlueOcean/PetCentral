import Head from "next/head";
import Link from "next/link";
import { Check } from "lucide-react";

import { api } from "@/utils/api";
import { Example } from "@/components/Example";

export default function FindFriendsPage() {
  const hello = api.example.hello.useQuery({ text: "example hi" });

  return (
    <main className="flex w-full flex-col justify-center">
      <h1>Find Some Friends</h1>
      <section className="flex w-full justify-between ">
        <button className="btn btn-circle btn-success">X</button>
        <div>IMG</div>
        <button className="btn btn-circle btn-error">
          <Check />
        </button>
      </section>
      <section>
        <h2 className="text-center">Filter Friends</h2>
        <div>
          <div>
            <label>Friends within 10 miles</label>
            <p>slider</p>
          </div>
          <button>Search</button>
        </div>
        <ul className="flex flex-wrap gap-3">
          <li>
            <button className="btn">Dog</button>
          </li>
          <li>
            <button className="btn">Dog</button>
          </li>
          <li>
            <button className="btn">Dog</button>
          </li>
          <li>
            <button className="btn">Dog</button>
          </li>
          <li>
            <button className="btn">Dog</button>
          </li>
          <li>
            <button className="btn">Dog</button>
          </li>
          <li>
            <button className="btn">Dog</button>
          </li>
          <li>
            <button className="btn">Dog</button>
          </li>
          <li>
            <button className="btn">Dog</button>
          </li>
        </ul>
      </section>

      <p className="text-2xl ">
        {hello.data ? hello.data.greeting : "Loading tRPC query..."}
      </p>
      <Example />
    </main>
  );
}
