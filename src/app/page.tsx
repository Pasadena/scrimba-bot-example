"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { ask, ConversationMessage } from "./actions";

export default function Home() {
  const [value, setValue] = React.useState("");
  const [conversation, setConversation] = React.useState<ConversationMessage[]>(
    []
  );
  const conversationRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    conversationRef.current?.scrollTo({
      top: 9999,
      behavior: "smooth",
    });
  }, [conversation]);
  return (
    <main>
      <section className="chatbot-container">
        <div className="chatbot-header">
          <Image
            src="logo-scrimba.svg"
            width={50}
            height={50}
            alt="Picture of the author"
            className="logo"
            priority
          />
          <p className="sub-heading">Knowledge Bank</p>
        </div>
        <div
          className="chatbot-conversation-container"
          id="chatbot-conversation-container"
          ref={conversationRef}
        >
          {conversation.map((item, index) => (
            <div
              key={index}
              className={`speech ${
                item.type === "ai" ? "speech-ai" : "speech-user"
              }`}
            >
              <p>{item.message}</p>
            </div>
          ))}
        </div>
        <form id="form" className="chatbot-input-container">
          <input
            name="user-input"
            type="text"
            id="user-input"
            required
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            id="submit-btn"
            className="submit-btn"
            onClick={async (e) => {
              e.preventDefault();
              setConversation([
                ...conversation,
                { message: value, type: "user" },
              ]);
              const questionResponse = await ask(value);
              setConversation((prev: ConversationMessage[]) => {
                return [...prev, questionResponse];
              });
            }}
          >
            <Image
              src="send.svg"
              width={50}
              height={50}
              alt="Picture of the author"
              className="send-btn-icon"
            />
          </button>
        </form>
      </section>
    </main>
  );
}
