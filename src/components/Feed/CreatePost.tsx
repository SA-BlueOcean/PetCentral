import React, { useState, useEffect } from 'react';
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function CreatePost() {
  const { data } = useSession() || '';
  const [user, setUser] = useState({});
  const [groups, setGroups] = useState([]);

  // Fetch User Details & Session Info
  // const query = api.users.fetchUser.useQuery({
  //   userID: data?.user?.id,
  // });

  // Fetch Groups
  const groupsQuery = api.groups.fetchGroups.useQuery({});

  useEffect(() => {
    if (groupsQuery.data) {
      setGroups(groupsQuery.data);
    };
  }, []);

  return (
    <div className="ring-base-500 rounded-lg bg-base-100 ring-1">
    <div className="p-3">
      <div className="flex">
        <div className="flex items-center gap-2 w-full">
          <div className="relative h-10 w-10 overflow-clip rounded-full ">
          <div className="avatar">
            <div className="rounded-full">
              <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          </div>
          <div className="w-full">
            <input
              type="text"
              placeholder="Write a new post..."
              className="input input-ghost w-full pl-1" />
          </div>
        </div>
      </div>
      <div className="p-1 flex justify-between items-center">
      <select className="select select-ghost pl-1 max-w-xs text-secondary-content grow">
        <option disabled selected>Choose a community</option>
        {groups?.map((g) => (
          <option
            key={g.id}>
              {g.name}
          </option>
          )
        )}
      </select>
      <div className="flex text-sm leading-6 text-gray-600">
        <label
          htmlFor="file-upload"
          className="relative cursor-pointer rounded-md "
        >
          <span>Upload a file</span>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
        </label>
      </div>
      <button className="btn btn-primary btn-sm rounded-btn text-white uppercase">Post</button>
      </div>
    </div>
  </div>
  )
}