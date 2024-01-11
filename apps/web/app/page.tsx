"use client";

import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

  return (
    <div>
      <div>
        <div>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={classes["chat-input"]}
            placeholder="Message..."
          />
          <button
            className={classes["send-btn"]}
            onClick={() => sendMessage(message)}
          >
            Send
          </button>
        </div>

        <div>
          <h1>All message will appear here</h1>
        </div>
        {messages.map((msg) => (
          <li>{msg}</li>
        ))}
      </div>
    </div>
  );
}
