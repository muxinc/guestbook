import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "utils/supabaseClient";

type SupabaseActivity = any;

export enum MessageType {
  RECORDER = "MediaRecorder",
  NEXT = "Next.JS",
  UPCHUNK = "Mux UpChunk",
  SUPABASE = "Supabase",
  MUX = "Mux Video",
}
type Message = {
  content: string;
  data?: any;
  type: MessageType;
};
type ConsoleContextValue = {
  messages: Message[];
  setMessage: (message: Message) => void;
};
type DefaultValue = undefined;
type ContextValue = ConsoleContextValue | DefaultValue;

export const ConsoleContext = createContext<ContextValue>(undefined);

const consoleColors: Record<MessageType, string> = {
  [MessageType.RECORDER]: "red",
  [MessageType.UPCHUNK]: "orange",
  [MessageType.NEXT]: "green",
  [MessageType.SUPABASE]: "blue",
  [MessageType.MUX]: "magenta",
};

interface ProviderProps {
  children: React.ReactNode;
}

const ConsoleProvider = ({ children }: ProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const setMessage = useCallback((message: Message) => {
    console.log(
      `%c[${message.type}]: ${message.content}`,
      `color: ${consoleColors[message.type]}`
    );
    if (typeof message.data !== "undefined") {
      console.log(message.data);
    }
    setMessages((m) => [message, ...m]);
  }, []);
  /* We listen for messages from the database to slip on in here */
  useEffect(() => {
    const subscription = supabase
      .from<SupabaseActivity>("activity")
      .on("*", (payload) => {
        setMessage({
          content: "(Webhook)",
          data: JSON.parse(payload.new.payload),
          type: MessageType.MUX,
        });
      })
      .subscribe();
    const unsubscribe = async () => {
      await supabase.removeSubscription(subscription);
    };
    return () => {
      unsubscribe();
    };
  });

  /* Finally, we wrap this all up in a provider to give it to our children */
  const value = {
    messages,
    setMessage,
  };
  return (
    <ConsoleContext.Provider value={value}>{children}</ConsoleContext.Provider>
  );
};

export const useConsoleContext = () =>
  useContext(ConsoleContext) as ConsoleContextValue;
export default ConsoleProvider;
