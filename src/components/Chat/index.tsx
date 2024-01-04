import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import ChatRoom from "./ChatRoom";
import { useSession } from "next-auth/react";
import { supabase } from "lib/supabase";
import type { ChatUsers } from "@prisma/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { cn } from "@/utils/cn";
import { ArrowLeft, ChevronsDown, ChevronsUp } from "lucide-react";
import Avatar from "../Feed/Avatar";
import { useGlobalContext } from "@/providers/GlobalContext";

type SupaChatsJoins = {
  User: { id: string; name: string; profilePhotoUrl?: string };
  chatsId: number;
  id: number;
};

export default function Chat() {
  const session = useSession();
  const [expand, setExpand] = useState(false);
  const [chats, setChats] = useState<SupaChatsJoins[]>();
  const [activeChat, setActiveChat] = useState<number | undefined>();
  const { openChatTrigger, setDisplayLoginModal } = useGlobalContext();

  useEffect(() => {
    openChatTrigger > 0 && setExpand(true);
  }, [openChatTrigger]);

  useEffect(() => {
    const getChats = async () => {
      const chats = await supabase
        .from("ChatUsers")
        .select("*")
        .eq("userId", session.data?.user.id);
      if (chats.data) {
        const chatIds = chats.data?.map((d) => d.chatsId) as string[];
        const { data, error } = await supabase
          .from("ChatUsers")
          .select(
            `
          id,
          chatsId,
          User (
            id,
            name,
            profilePhotoUrl
          )          
          `,
          )
          .in("chatsId", chatIds)
          .neq("userId", session.data?.user.id);
        if (data) {
          setChats(data as unknown as SupaChatsJoins[]);
        }
      }
    };
    let channels: RealtimeChannel;
    if (session.data?.user.id) {
      getChats();
      channels = supabase
        .channel("chats-channel")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "ChatUsers",
            filter: `userId=eq.${session.data.user.id}`,
          },
          (payload) => {
            console.log("chats update?", payload);
            void getChats();
          },
        )
        .subscribe();
    }

    return () => {
      channels?.unsubscribe();
    };
  }, [session.data?.user.id]);

  const selectedUser = chats?.find((c) => c.chatsId === activeChat);

  return (
    <div
      className={cn(
        "h-[50vh] w-80 rounded-lg rounded-b-none bg-accent/80 text-neutral backdrop-blur-md transition-transform pointer-events-auto",
        expand ? "translate-y-0" : "translate-y-[calc(100%-3rem)] ",
      )}
    >
      <div
        onClick={() => !activeChat && setExpand((e) => !e)}
        className="flex h-12 items-center justify-between border-b border-b-accent px-4"
      >
        {activeChat ? (
          <div className="flex items-center gap-2">
            <button
              className="btn btn-circle btn-ghost"
              onClick={() => setActiveChat(undefined)}
            >
              <ArrowLeft />
            </button>

            <h2 className="text-lg">{selectedUser?.User?.name}</h2>
          </div>
        ) : (
          <h2 className="text-lg">Messages</h2>
        )}

        <button
          className="btn btn-circle btn-ghost p-1"
          onClick={() => activeChat && setExpand((e) => !e)}
        >
          {expand ? <ChevronsDown /> : <ChevronsUp />}
        </button>
      </div>
      <div
        className={cn(
          "h-full",
          session.status === "unauthenticated" &&
            "flex items-center justify-center",
        )}
      >
        {session.status === "unauthenticated" && (
          <button
            className="btn btn-accent mb-12 rounded-l-full rounded-r-full "
            onClick={() => setDisplayLoginModal(true)}
          >
            Sign in To Chat
          </button>
        )}
        {activeChat ? (
          <ChatRoom chatId={activeChat} />
        ) : (
          <ul className="max-h-[calc(100%-3rem)] overflow-auto">
            {chats?.map((chat) => (
              <li
                key={chat.id}
                onClick={() => setActiveChat(chat.chatsId)}
                className="flex items-center gap-2 p-4 hover:cursor-pointer hover:bg-accent"
              >
                <div className="relative h-8 w-8 overflow-clip rounded-full">
                  <Avatar profilePhotoUrl={chat.User.profilePhotoUrl} />
                </div>

                {chat.User.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
