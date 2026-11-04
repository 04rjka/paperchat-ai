import { Suspense } from "react";
import NewChat from "@/components/new-chat";
import { Loader2 } from "lucide-react";

export default function NewChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <NewChat />
    </Suspense>
  );
}