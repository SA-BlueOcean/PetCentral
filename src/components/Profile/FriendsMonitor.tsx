import { api } from "@/utils/api";
import { Friend } from "@prisma/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "lib/supabase";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function FriendsMonitor() {
  const session = useSession();
  const utils = api.useUtils();
  const [newFriends, setNewFriends] = useState<
    { name: string; id: string; firstName?: string; lastName?: string }[]
  >([]);

  useEffect(() => {
    const removeFirstElement = () => {
      if (newFriends.length > 0) {
        setNewFriends((f) => f.slice(1));
      }
    };
    const intervalId = setInterval(() => {
      removeFirstElement();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [newFriends]);

  useEffect(() => {
    let monitor: RealtimeChannel;
    if (session.data?.user.id) {
      monitor = supabase
        .channel("friends-channel")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "Friend",
            filter: "status=eq.ACCEPTED",
          },
          (payload) => {
            const newPayload = payload.new as Friend;
            if (newPayload && newPayload.friendBId === session.data.user.id) {
              const newFriendId = newPayload.friendAId;
              const update = async () => {
                const { data, error } = await supabase
                  .from("User")
                  .select("name, firstName, lastName, id")
                  .eq("id", newFriendId);
                if (data && data?.[0] && data[0].id && data[0].name) {
                  setNewFriends((f) => [
                    ...f,
                    {
                      id: (data as any[])[0].id as string,
                      name: (data as any[])[0].name as string,
                      firstName: (data as any[])[0]?.firstName as string,
                      lastName: (data as any[])[0]?.lastName as string,
                    },
                  ]);
                }
              };
              update();
              void utils.friends.getFriends.invalidate();
            }
          },
        )
        .subscribe();
    }
    return () => {
      monitor?.unsubscribe();
    };
  }, [session.data?.user.id]);

  return (
    <div className="toast toast-start z-50">
      {newFriends?.map((f) => (
        <div
          key={f.id}
          className="alert alert-success text-sm"
          onClick={() => {
            setNewFriends((p) => p?.filter((n) => n.id !== f.id));
          }}
        >
          <span>
            {f.firstName
              ? `${f.firstName}${f.lastName ? ` ${f.lastName}` : ""}`
              : `${f.name ?? "?"}`}{" "}
            added as friend!
          </span>
        </div>
      ))}
    </div>
  );
}
