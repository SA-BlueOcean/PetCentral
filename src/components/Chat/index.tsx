import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import ChatRoom from "./ChatRoom";
import { useSession } from "next-auth/react";
import { supabase } from "lib/supabase";
import type { ChatUsers } from "@prisma/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { cn } from "@/utils/cn";
import { ChevronsDown, ChevronsUp } from "lucide-react";

export default function Chat() {
  const session = useSession();
  const [expand, setExpand] = useState(false);
  const [chats, setChats] = useState<ChatUsers[]>();
  const [activeChat, setActiveChat] = useState<number | undefined>();
  useEffect(() => {
    const getChats = async () => {
      const chats = await supabase
        .from("ChatUsers")
        .select("*")
        .eq("userId", session.data?.user.id);
      if (chats.data) {
        const chatIds = chats.data?.map((d) => d.chatsId) as string[];
        console.log("d?", chatIds);
        const { data, error } = await supabase
          .from("ChatUsers")
          .select(
            `
          id,
          chatsId,
          ,
          Users (
            id,
            name,
            profilePhotoUrl
          )
          `,
          )
          .in("chatId", chatIds);
        console.log("chats?", data);
        setChats(data);
      }
    };
    let channels: RealtimeChannel;
    if (session.data?.user.id) {
      getChats();
      channels = supabase.channel("chats-channel").on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ChatUsers",
          filter: `userId=${session.data.user.id}`,
        },
        (payload) => {
          console.log("chats update?", payload);
        },
      );
    }

    return () => {
      channels?.unsubscribe();
    };
  }, [session.data?.user.id]);

  return (
    <div
      className={cn(
        "h-[50vh] w-80 rounded-lg bg-accent/80 text-neutral backdrop-blur-md transition-transform rounded-b-none",
        expand ? "translate-y-0" : "translate-y-[calc(100%-3rem)] ",
      )}
    >
      <div
        onClick={() => setExpand((e) => !e)}
        className="flex h-12 items-center justify-between px-4"
      >
        <h2 className="text-lg">Messages</h2>
        <button className="p-1">{expand ? <ChevronsDown /> : <ChevronsUp />}</button>
      </div>
      <div>
        {activeChat ? (
          <ChatRoom chatId={activeChat} />
        ) : (
          <ul className="">
            {chats?.map((chat) => (
              <li key={chat.id} onClick={() => setActiveChat(chat.chatsId)}>
                chat {chat.chatsId}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
