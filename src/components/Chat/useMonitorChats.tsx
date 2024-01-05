import type { Messages } from "@prisma/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "lib/supabase";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export default function useMonitorChats(
  chatIds?: number[],
  activeChat?: number,
) {
  const session = useSession();
  const [messages, setMessages] = useState<Record<number, Messages[]>>({});
  const [notifs, setNotifs] = useState<
    Record<number, { count: number; last: Messages }>
  >({});
  useEffect(() => {
    let messagesWatcher: RealtimeChannel;
    if (session.data?.user.id && chatIds && chatIds.length > 0) {
      messagesWatcher = supabase
        .channel(`message-channel`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "Messages",
          },
          (payload) => {
            if (payload.new) {
              const newMessage = payload.new as Messages;
              if (typeof newMessage.createdAt === "string") {
                newMessage.createdAt = new Date(
                  Date.parse(newMessage.createdAt as string),
                );
              }
              if (chatIds.includes(newMessage.chatsId)) {
                setMessages((m) => {
                  const c = { ...m };
                  c[newMessage.chatsId] = [
                    ...(m[newMessage.chatsId] ?? []),
                    newMessage,
                  ];
                  return c;
                });
                if (activeChat !== newMessage.chatsId) {
                  setNotifs((n) => ({
                    ...n,
                    [newMessage.chatsId]: {
                      count: (n[newMessage.chatsId]?.count ?? 0) + 1,
                      last: newMessage,
                    },
                  }));
                }
              }
            }
          },
        )
        .subscribe();
    }
    return () => {
      messagesWatcher?.unsubscribe();
    };
  }, [chatIds, session.data?.user.id, activeChat]);

  const markMessagesRead = (chatId: number) => {
    setNotifs((m) => {
      const c = { ...m };
      delete c[chatId];
      return c;
    });
  };

  const insertMessages = useCallback((chatId: number, messages: Messages[]) => {
    setMessages((m) => {
      const p = m[chatId] ?? [];
      const combinedArray = [...p, ...messages];
      const uniqueArray = Array.from(
        new Set(combinedArray.map((item) => item.id)),
      )
        .map((id) => {
          return combinedArray.find((item) => item.id === id);
        })
        .filter((m) => !!m?.id)
        .sort((a, b) => {
          return (
            (a?.createdAt?.getTime() ?? 0) - (b?.createdAt?.getTime() ?? 0)
          );
        }) as Messages[];
      const c = { ...m };
      c[chatId] = uniqueArray;
      return c;
    });
  }, []);

  return {
    messages,
    notifs,
    markMessagesRead,
    insertMessages,
  };
}
