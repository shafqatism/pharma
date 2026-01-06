export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  department: string;
  designation: string;
  status: "online" | "offline" | "away" | "busy";
  lastSeen?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: "text" | "file" | "image" | "system";
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  timestamp: string;
  isEdited?: boolean;
  isForwarded?: boolean;
  forwardedFrom?: string;
  reactions?: { emoji: string; userId: string; userName: string }[];
  readBy?: string[];
}

export interface Chat {
  id: string;
  type: "direct" | "group" | "broadcast";
  name: string;
  participants: string[];
  participantNames: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  avatar?: string;
  createdBy?: string;
  description?: string;
  isAdmin?: string[];
}

export interface ChatState {
  users: ChatUser[];
  chats: Chat[];
  messages: ChatMessage[];
  currentUserId: string;
}
