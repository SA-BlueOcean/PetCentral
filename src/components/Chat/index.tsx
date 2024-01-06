import { useEffect, useState } from "react";
import ChatRoom from "./ChatRoom";
import { useSession } from "next-auth/react";
import { supabase } from "lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { cn } from "@/utils/cn";
import {
  ArrowLeft,
  ChevronsDown,
  ChevronsUp,
  ExternalLink,
} from "lucide-react";
import Avatar from "../Feed/Avatar";
import { useGlobalContext } from "@/providers/GlobalContext";
import useMonitorChats from "./useMonitorChats";
import Link from "next/link";

type SupaChatsJoins = {
  User: {
    id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    profilePhotoUrl?: string;
  };
  chatsId: number;
  id: number;
};

export default function Chat() {
  const session = useSession();
  const [expand, setExpand] = useState(false);
  const [chats, setChats] = useState<SupaChatsJoins[]>();
  const [activeChat, setActiveChat] = useState<number | undefined>();
  const { messages, markMessagesRead, insertMessages, notifs } =
    useMonitorChats(
      chats?.map((c) => c.chatsId),
      !expand && activeChat ? undefined : activeChat,
    );
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
            firstName,
            lastName,
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

  useEffect(() => {
    if (activeChat) {
      markMessagesRead(activeChat);
    }
  }, [activeChat]);

  return (
    <div
      className={cn(
        "pointer-events-auto h-[50vh] w-80 rounded-lg rounded-b-none bg-accent/80 text-neutral backdrop-blur-md transition-transform",
        expand ? "translate-y-0" : "translate-y-[calc(100%-3rem)] ",
      )}
    >
      <div
        onClick={() => (!activeChat || !expand) && setExpand((e) => !e)}
        className="relative flex h-12 items-center justify-between border-b border-b-accent px-4"
      >
        {Object.keys(notifs).length > 0 && (
          <div className="absolute left-0 top-0 z-50 h-1.5 w-1.5 animate-ping rounded-full bg-white ring-1 ring-accent"></div>
        )}
        {activeChat ? (
          <div className="flex items-center gap-2">
            {expand && (
              <button
                className="btn btn-circle btn-ghost"
                onClick={() => setActiveChat(undefined)}
              >
                <ArrowLeft />
              </button>
            )}

            <h2 className="py-1 text-lg">
              {selectedUser?.User.id && (
                <Link href={`/profile/${selectedUser?.User.id}`} className="link-hover">
                  <span className="truncate">
                    {selectedUser?.User?.firstName
                      ? `${selectedUser?.User?.firstName}${
                          selectedUser?.User?.lastName
                            ? ` ${selectedUser.User.lastName}`
                            : ""
                        }`
                      : `${selectedUser?.User?.name ?? "?"}`}
                  </span>
                </Link>
              )}
            </h2>
          </div>
        ) : (
          <h2 className="text-lg">Messages</h2>
        )}

        <button
          className="btn btn-circle btn-ghost p-1"
          onClick={() => activeChat && expand && setExpand((e) => !e)}
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
          <ChatRoom
            chatId={activeChat}
            messages={messages[activeChat] ?? []}
            insertNewMessage={insertMessages}
          />
        ) : (
          <ul className={cn("max-h-[calc(100%-3rem)] overflow-auto")}>
            {chats?.map((chat) => (
              <li
                key={chat.id}
                onClick={() => setActiveChat(chat.chatsId)}
                className="flex items-center gap-2 p-4 hover:cursor-pointer hover:bg-accent"
              >
                <div className="relative">
                  {(notifs[chat.chatsId]?.count ?? 0 > 0) && (
                    <div className="absolute left-0 top-0 z-50 h-1.5 w-1.5 animate-ping rounded-full bg-white ring-1 ring-accent"></div>
                  )}
                  <div className="relative h-8 w-8 overflow-clip rounded-full">
                    <Avatar profilePhotoUrl={chat.User.profilePhotoUrl} />
                  </div>
                </div>

                <div className="relative">
                  <div
                    className={cn(
                      "font-semibold",
                      notifs[chat.chatsId]?.last?.content && "-mt-3",
                    )}
                  >
                    {chat?.User?.firstName
                      ? `${chat?.User?.firstName}${
                          chat?.User?.lastName ? ` ${chat.User.lastName}` : ""
                        }`
                      : `${chat?.User?.name ?? "?"}`}
                  </div>
                  <div className="absolute max-w-60 truncate text-xs opacity-50">
                    {notifs[chat.chatsId]?.last?.content ?? (
                      <span className="select-none opacity-0">?</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
