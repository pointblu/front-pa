import React from "react";
import { useWeavy, WyMessenger } from "@weavy/uikit-react";

const token = JSON.parse(localStorage.getItem("chatToken"));
export function WeavyComponent() {
  useWeavy({
    url: "https://141d92ac517848f8b435c8ae7b6b2059.weavy.io",
    tokenFactory: async () => token.access_token,
  });
  return <WyMessenger uid="pa-chat"></WyMessenger>;
}
