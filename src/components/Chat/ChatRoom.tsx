import type { Messages } from "@prisma/client";
import type {
  RealtimeChannel,
} from "@supabase/supabase-js";
import { supabase } from "lib/supabase";
import { useSession } from "next-auth/react";
import { type FormEvent, useEffect, useState } from "react";

export default function ChatRoom({ chatId }: { chatId: number }) {
  const session = useSession();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Messages[]>();
  const [loading, setLoading] = useState(false);

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
    <div className="">
      <h2>chat {chatId}</h2>
      <div>{messages?.map((m) => <div key={m.id}>{m.content}</div>)}</div>
      <form onSubmit={handleSend}>
        <input
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          value={message}
          type="text"
        ></input>
        <button>send</button>
      </form>
    </div>
  );
}
