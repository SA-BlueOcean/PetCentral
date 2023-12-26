import { api } from "@/utils/api";
import Image from "next/image";

export function ProfileHeader() {
  return (
    <>
      <div>
        {/* PROFILE BANNER */}
        <Image
          src="https://img.freepik.com/premium-photo/banner-large-group-dogs-together-row-orange-background_191971-28737.jpg?w=1380"
          alt="Background"
          width={700}
          height={200}
          unoptimized={true}
        ></Image>
        {/* PROFILE PICTURE */}
        <div className="avatar" style={{ marginTop: "-5rem" }}>
          <div className="relative w-20 overflow-hidden rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 sm:w-40">
            <Image
              src="https://www.petsecure.com.au/wp-content/uploads/2021/04/man-carrying-dog-first-time-pet-owner-pet-parent.jpg"
              alt="profile picture"
              unoptimized={true}
              fill={true}
            />
          </div>
        </div>
        <div>
          {/* PROFILE NAME */}
          <div style={{ marginLeft: "11rem", marginTop: "-5rem" }}>
            <p
              style={{ fontSize: "2rem", fontWeight: "bold" }}
              className="pl-5"
            >
              John Doe
            </p>
            <div>
              <span className="px-4"> Cleveland, OH </span>|
              <span className="px-4"> 420 pets </span>|
              <span className="px-4">69 Pals </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
