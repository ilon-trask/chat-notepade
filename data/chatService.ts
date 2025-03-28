import { Chat, ChatUpdate } from "@/types/chat";
import { v4 as uuid } from "uuid";
import messageService from "./messageService";
import { ChatStore } from "@/store/chatStore";
import DBResPromise from "@/helpers/DBResPromise";
import { DBService } from "./DBService";
import { MessageStore } from "@/store/messageStore";

export const CHAT_LABEL = "chat";

class ChatService extends DBService<Chat> {
  constructor() {
    super(CHAT_LABEL);
  }
  async getAllChats(db: IDBDatabase, chatStore: ChatStore) {
    const chats = await super.getAll(db);
    chatStore.setChats(chats);
  }
  async createChat(db: IDBDatabase, chatStore: ChatStore, name: string) {
    const newChat = { id: uuid(), name, createdAt: new Date() };
    await super.create(db, newChat);
    chatStore.addChat(newChat);
  }
  async deleteChat(
    db: IDBDatabase,
    chatStore: ChatStore,
    messageStore: MessageStore,
    id: string
  ) {
    await messageService.deleteChatMessages(db, messageStore, id);
    await super.delete(db, id);
    chatStore.deleteChat(id);
  }
  async updateChat(db: IDBDatabase, chatStore: ChatStore, data: ChatUpdate) {
    const chat = chatStore.getChatById(data.id);
    if (!chat) throw new Error("Chat not found");
    const newChat = { ...data, createdAt: chat.createdAt };
    await super.update(db, newChat);
    chatStore.updateChat(newChat);
  }
}

export default new ChatService();
