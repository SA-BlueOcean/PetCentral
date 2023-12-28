import { api } from "@/utils/api";
import Image from "next/image";

type Group = {
    id: string;
    name: string;
    description: string;
    photoUrl: string;
    bannerPhotoUrl: string;
};

type GroupProps = {
    group: Group;
    members: number;
};

export function GroupHeader({ group, members } : GroupProps) {
const { name, description, photoUrl, bannerPhotoUrl } = group;

  return (
    <>
      <div>
        {/* GROUP BANNER */}
        <Image
          src={bannerPhotoUrl}
          alt={`${name} banner background`}
          width={700}
          height={100}
          unoptimized={true}
          className="w-full h-20 object-cover"
        ></Image>

        {/* GROUP AVATAR */}
        <div className="avatar w-11/12 mx-auto block sm:-mt-8 max-h-20">
          <div className="relative overflow-hidden rounded ring ring-base-300 ring-offset-2 ring-offset-base-300 sm:w-20 max-h-20 w-full">
            <Image
              src={photoUrl}
              alt="group avatar"
              unoptimized={true}
              fill={true}
            />
          </div>
          {/* GROUP META */}
          <div
            className="inline-block -mt-10 ml-24"
          >
            <div className="flex flex-row">
              <span className="basis-4/5 text-l font-bold">{name}</span>
              <span className="basis-1/5">{members} Members</span>
            </div>
            <p className="text-sm">{description}</p>
          </div>
        </div>
      </div>
    </>
  );
}
