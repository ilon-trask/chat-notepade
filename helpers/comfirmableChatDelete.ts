import { Chat } from "@/types/chat.types";
import confirmableDelete from "./confirmableDelete";
import { ChatStore } from "@/store/chatStore";
import ChatService from "@/data/chatService";

export default function confirmableChatDelete(
  chatStore: ChatStore,
  id: string,
  chatService: ChatService
) {
  confirmableDelete<Chat>({
    getEntity: () => chatStore.getChatById(id),
    onDelete: () => chatService.deleteChat(id),
    onStoreDelete: () => {
      chatStore.deleteChat(id);
      chatStore.setChosenChatId("")
    },
    onReverseDelete: (chat: Chat) => chatStore.addChat(chat),
    name: "Chat",
  });
}
