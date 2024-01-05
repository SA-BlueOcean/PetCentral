import { cn } from "@/utils/cn";
import type { Messages } from "@prisma/client";
import { supabase } from "lib/supabase";
import { SendHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { type FormEvent, useEffect, useState, useRef } from "react";

export default function ChatRoom({
  chatId,
  messages,
  insertNewMessage,
}: {
  chatId: number;
  messages: Messages[];
  insertNewMessage: (chatId: number, messages: Messages[]) => void;
}) {
  const session = useSession();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const utc = new Date();
  const offset = utc.getTimezoneOffset();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const getAllMessages = async (chatId: number) => {
      const messages = await supabase
        .from("Messages")
        .select("*")
        .eq("chatsId", chatId);
      messages.data &&
        insertNewMessage &&
        insertNewMessage(
          chatId,
          messages.data.map((m) => {
            if (m["createdAt"] && typeof m["createdAt"] === "string") {
              m["createdAt"] = new Date(Date.parse(m["createdAt"]));
            }
            return m;
          }),
        );
    };
    if (chatId) {
      void getAllMessages(chatId);
    }
  }, [chatId, insertNewMessage]);

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.length > 0 && !loading) {
      setLoading(true);
      const { data, error } = await supabase.from("Messages").insert([
        {
          chatsId: chatId,
          userId: session.data?.user.id,
          content: message,
        },
      ]);
      if (!error) {
        setMessage("");
      }
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full">
      <div
        ref={scrollRef}
        className="max-h-[calc(100%-6rem)] overflow-auto overscroll-none"
      >
        {messages?.map((m, i) => (
          <div
            key={m.id}
            className={cn(
              "chat",
              m.userId === session.data?.user.id ? "chat-end" : "chat-start",
            )}
          >
            {/* check for 10 minute interval between timestamps */}
            {(i === 0 ||
              (i > 0 &&
                messages[i - 1]?.createdAt.getTime() &&
                (messages[i - 1]?.createdAt.getTime() ?? 0) + 10 * 60 * 1000 <
                  m.createdAt.getTime())) && (
              <div className="chat-header text-xs opacity-50">
                {// utcToZonedTime(m.createdAt, userTimezone).toLocaleTimeString(
                //   undefined,
                //   { timeStyle: "short" },
                // )
                new Date(
                  m?.createdAt.getTime() - 60000 * offset,
                )?.toLocaleTimeString(undefined, {
                  timeStyle: "short",
                })
                // utcToZonedTime(m.createdAt, userTimezone).toLocaleTimeString(
                //   undefined,
                //   { timeStyle: "short" },
                // )
                }
              </div>
            )}

            <div
              className={cn(
                "chat-bubble",
                m.userId === session.data?.user.id
                  ? ""
                  : "chat-bubble-secondary",
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSend}
        className="join absolute bottom-12 left-0 right-0 flex w-full items-center bg-accent text-black"
      >
        <input
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          value={message}
          type="text"
          className="join-item h-12 flex-grow rounded-none px-2 focus:outline-none"
        ></input>
        <button
          aria-label="send"
          className="btn join-item h-12 min-h-12 rounded-none"
        >
          <SendHorizontal />
        </button>
      </form>
    </div>
  );
}
