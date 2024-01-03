import { supabase } from "lib/supabase";
import { useEffect } from "react";

export default function Chat() {
  const getAllMessages = async (chatId: number) => {
    const messages = await supabase
      .from("Messages")
      .select("*")
      .eq("chatsId", chatId);
  };

  // useEffect(() => {
  //   const messagesWatcher = supabase
  //     .channel("chat-channel")
  //     .on(
  //       "postgres_changes",
  //       { event: "*", schema: "public", table: "Messages" },
  //       async () => {
  //         const data = await getAllMessages();
  //         return data;
  //       },
  //     ).subscribe()
  // }, []);

  return (
    <div className="">
      chat
      <input
        onChange={(e) => {
          console.log(e);
        }}
      ></input>
    </div>
  );
}
