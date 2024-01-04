import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import ChatRoom from "./ChatRoom";
import { useSession } from "next-auth/react";
import { supabase } from "lib/supabase";
import type { ChatUsers } from "@prisma/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export default function Chat() {
  const session = useSession();
  const [chats, setChats] = useState<ChatUsers[]>();
  const [activeChat, setActiveChat] = useState<number | undefined>();
  useEffect(() => {
    const getChats = async () => {
      const { data, error } = await supabase
        .from("ChatUsers")
        .select("*")
        .eq("userId", session.data?.user.id);
      if (data) {
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
    <div className="h-[50vh] w-[30vw] rounded-lg bg-primary">
      <h2>Chat</h2>
      <ul>
        {chats?.map((chat) => (
          <li key={chat.id} onClick={() => setActiveChat(chat.chatsId)}>
            chat {chat.chatsId}
          </li>
        ))}
      </ul>
      {activeChat && <ChatRoom chatId={activeChat} />}
    </div>
  );
}
