import { useDBContext } from "@/contexts/dbContext";
import { useMessageInputStore } from "@/store/messageInputStore";
import { useMessageStore } from "@/store/messageStore";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Edit, Trash2 } from "lucide-react";
import { Card } from "../ui/card";
import confirmableDelete from "@/helpers/confirmableDelete";
import { cn } from "@/lib/utils";
import { Message } from "@/types/message";
import messageService from "@/data/messageService";

export default function MessageItem({
  children,
  className,
  id,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  id: string;
}) {
  const db = useDBContext();
  const messageStore = useMessageStore();
  const messageInputStore = useMessageInputStore();

  const handleEdit = () => {
    //timeout to prevent menu stealing focus form message input
    setTimeout(() => {
      messageInputStore.startEditing(id, children as string);
    }, 200);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card
          className={cn(
            "p-3 rounded-lg max-w-[70%] self-start gap-2",
            className
          )}
          {...props}
        >
          <div className="flex flex-col">
            <p>{children}</p>
            <div className="text-xs text-gray-500 text-right text-[10px] mt-1 self-end">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </ContextMenuItem>
        <ContextMenuItem
          className="text-destructive"
          onClick={() => {
            confirmableDelete<Message>({
              getEntity: () => messageStore.getMessageById(id),
              onDelete: () =>
                messageService.deleteMessage(db, messageStore, id),
              onStoreDelete: () => messageStore.deleteMessage(id),
              onReverseDelete: (message: Message) =>
                messageStore.addMessage(message),
              name: "Message",
            });
          }}
        >
          <Trash2 className="mr-2 h-4 w-4 text-destructive" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
