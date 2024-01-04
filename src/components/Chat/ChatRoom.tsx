import { cn } from "@/utils/cn";
import type { Messages } from "@prisma/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "lib/supabase";
import { SendHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { type FormEvent, useEffect, useState, useRef } from "react";

export default function ChatRoom({ chatId }: { chatId: number }) {
  const session = useSession();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Messages[]>();
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      messages.data && setMessages(messages.data);
    };
    let messagesWatcher: RealtimeChannel;
    if (chatId) {
      void getAllMessages(chatId);
      messagesWatcher = supabase
        .channel(`message-channel`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "Messages",
            filter: `chatsId=eq.${chatId}`,
          },
          (payload) => {
            console.log("payload?", payload);
            if (payload.new) {
              const newMessage = payload.new as Messages;
              setMessages((m) => (m ? [...m, newMessage] : [newMessage]));
            }
          },
        )
        .subscribe();
    }
    return () => {
      messagesWatcher?.unsubscribe();
    };
  }, [chatId]);

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
      <div ref={scrollRef} className="max-h-[calc(100%-6rem)] overflow-auto overscroll-none">
        {messages?.map((m) => (
          <div
            key={m.id}
            className={cn(
              "chat",
              m.userId === session.data?.user.id ? "chat-end" : "chat-start",
            )}
          >
            {/* <div className="chat-header text-xs opacity-50">
              {m?.createdAt?.toTimeString()}
            </div> */}
            <div className="chat-bubble">{m.content}</div>
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
