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
          style={{width: '100%', height: '100px', objectFit: 'cover'}}
        ></Image>

        {/* GROUP AVATAR */}
        <div className="avatar w-11/12 mx-auto block -mt-8 max-h-20">
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
            <p>
              <span className="text-l font-bold">{name}</span>
              <span className="float-end">{members} Members</span>
            </p>
            <p className="text-sm">{description}</p>
          </div>
        </div>
      </div>
    </>
  );
}
