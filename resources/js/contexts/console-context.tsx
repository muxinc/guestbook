import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// import { Database } from "utils/DatabaseDefinitions";

export enum MessageType {
  RECORDER = "MediaRecorder",
  LARAVEL = "Laravel",
  UPCHUNK = "Mux UpChunk",
  MUX = "Mux Video",
  ERROR = "Error",
}
type Message = {
  content: string;
  data?: unknown;
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
  [MessageType.RECORDER]: "#fb2491",
  [MessageType.UPCHUNK]: "#fb501d",
  [MessageType.MUX]: "#fb3c4e",
  [MessageType.ERROR]: "#ff0000",
  [MessageType.LARAVEL]: "#000000",
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

  // useEffect(() => {
  //   const channel = supabase
  //     .channel("activity")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "activity",
  //       },
  //       ({
  //         new: { payload },
  //       }: {
  //         new: Database["public"]["Tables"]["activity"]["Row"];
  //       }) => {
  //         setMessage({
  //           content: "(Webhook)",
  //           data: payload ? JSON.parse(payload) : null,
  //           type: MessageType.MUX,
  //         });
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // });

  /* Finally, we wrap this all up in a provider to give it to our children */
  const value = {
    messages,
    setMessage,
  };
  return (
    <ConsoleContext.Provider value={value}>{children}</ConsoleContext.Provider>
  );
};

export const useConsoleContext = () => {
  const context = useContext(ConsoleContext);
  if (typeof window === 'undefined') {
    // Return a no-op implementation for SSR
    return {
      messages: [],
      setMessage: () => {},
    };
  }
  return context as ConsoleContextValue;
};
export default ConsoleProvider;
