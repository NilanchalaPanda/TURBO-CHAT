"use client";

import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";

export default function Page() {
  const { sendMessage } = useSocket();
  const [message, setMessage] = useState("");

  return (
    <div>
      <div>
        <div>
          <h1>All message will appear here</h1>
        </div>
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
      </div>
    </div>
  );
}
