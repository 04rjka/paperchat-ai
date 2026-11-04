"use client"
import { useEffect, useState } from "react";
import { fetchChats, Conversation,deleteChat } from "@/lib/services/chat"
import Link from "next/link";
import { Loader2, MessageSquarePlus,Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [chats, setChats] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchChats()
      .then((res) => {
        console.log("API response:", res.data);
        setChats(res.data)
      })
      .catch(() => setError("Failed to load chats"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex flex-1 items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  )
  if (error) return <p>{error}</p>;

  return (
  <div className="flex flex-col flex-1 items-center justify-start bg-background font-sans p-3">
    {chats.length === 0 ? (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <MessageSquarePlus className="h-10 w-10 text-muted-foreground" />
        <h2 className="text-lg font-medium">No chats yet</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Upload a PDF and ask questions about it. Your conversations will show up here.
        </p>
        <Button nativeButton={false} render={<Link href="/upload" />}>Upload a document</Button>
      </div>
    ) : (
      chats.map((c) => (
        <div
          key={c.id}
          className="mb-2 flex w-full max-w-xl items-center gap-2 rounded-lg border border-border hover:bg-muted"
        >
          <Link
            href={`/chats/${c.id}`}
            className="flex min-w-0 flex-1 flex-col gap-1 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5"
          >
            <h3 className="min-w-0 truncate font-medium text-foreground capitalize-first">
              {c.title}
            </h3>
            <p className="text-xs text-muted-foreground sm:whitespace-nowrap sm:text-sm">
              {new Date(c.created_at).toLocaleString()}
            </p>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 shrink-0 text-muted-foreground hover:text-destructive"
            aria-label="Delete chat"
            onClick={() => {
              deleteChat(c.id)
              setChats((prev) => prev.filter((chat) => chat.id !== c.id));
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))
    )}
  </div>
);
}
