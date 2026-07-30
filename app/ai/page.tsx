import { Suspense } from "react";
import { AiChatPage } from "./AiChatPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AiChatPage />
    </Suspense>
  );
}
