import { create } from "zustand";
import { Chat, ChatMessage, ChatUser } from "@/types/chat";

// Seed data for chat users based on HRM staff
const seedUsers: ChatUser[] = [
  { id: "user-1", name: "Ahmed Khan", department: "HR", designation: "HR Manager", status: "online" },
  { id: "user-2", name: "Fatima Ali", department: "Finance", designation: "Finance Director", status: "online" },
  { id: "user-3", name: "Hassan Raza", department: "Production", designation: "Production Manager", status: "away" },
  { id: "user-4", name: "Ayesha Malik", department: "Quality", designation: "QA Manager", status: "online" },
  { id: "user-5", name: "Usman Sheikh", department: "IT", designation: "IT Manager", status: "busy" },
  { id: "user-6", name: "Sana Tariq", department: "HR", designation: "HR Executive", status: "online" },
  { id: "user-7", name: "Bilal Ahmed", department: "Procurement", designation: "Procurement Head", status: "offline", lastSeen: "2 hours ago" },
  { id: "user-8", name: "Zainab Hussain", department: "Marketing", designation: "Marketing Manager", status: "online" },
];

const seedChats: Chat[] = [
  {
    id: "chat-1",
    type: "direct",
    name: "Fatima Ali",
    participants: ["user-1", "user-2"],
    participantNames: ["Ahmed Khan", "Fatima Ali"],
    lastMessage: "Please review the payroll report",
    lastMessageTime: "10:30 AM",
    unreadCount: 2,
  },
  {
    id: "chat-2",
    type: "direct",
    name: "Hassan Raza",
    participants: ["user-1", "user-3"],
    participantNames: ["Ahmed Khan", "Hassan Raza"],
    lastMessage: "Production schedule updated ✅",
    lastMessageTime: "9:45 AM",
    unreadCount: 0,
  },
  {
    id: "chat-3",
    type: "group",
    name: "HR Team",
    participants: ["user-1", "user-6", "user-2"],
    participantNames: ["Ahmed Khan", "Sana Tariq", "Fatima Ali"],
    lastMessage: "Meeting at 3 PM today",
    lastMessageTime: "11:00 AM",
    unreadCount: 5,
    description: "HR Department Group Chat",
    isAdmin: ["user-1"],
  },
  {
    id: "chat-4",
    type: "group",
    name: "Management Team",
    participants: ["user-1", "user-2", "user-3", "user-4", "user-5"],
    participantNames: ["Ahmed Khan", "Fatima Ali", "Hassan Raza", "Ayesha Malik", "Usman Sheikh"],
    lastMessage: "Q4 targets discussion",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    description: "Senior Management Discussion Group",
    isAdmin: ["user-1", "user-2"],
  },
  {
    id: "chat-5",
    type: "broadcast",
    name: "Company Announcements",
    participants: ["user-1", "user-2", "user-3", "user-4", "user-5", "user-6", "user-7", "user-8"],
    participantNames: ["All Staff"],
    lastMessage: "Holiday notice for Dec 25",
    lastMessageTime: "Dec 20",
    unreadCount: 0,
    description: "Official company announcements",
    createdBy: "user-1",
    isAdmin: ["user-1"],
  },
];


const seedMessages: ChatMessage[] = [
  // Chat 1 - Direct with Fatima
  { id: "msg-1", chatId: "chat-1", senderId: "user-2", senderName: "Fatima Ali", content: "Hi Ahmed, good morning! 👋", type: "text", timestamp: "10:15 AM", readBy: ["user-1"] },
  { id: "msg-2", chatId: "chat-1", senderId: "user-1", senderName: "Ahmed Khan", content: "Good morning Fatima! How are you?", type: "text", timestamp: "10:18 AM", readBy: ["user-2"] },
  { id: "msg-3", chatId: "chat-1", senderId: "user-2", senderName: "Fatima Ali", content: "I'm good, thanks! I've prepared the payroll report for this month 📊", type: "text", timestamp: "10:25 AM", readBy: ["user-1"] },
  { id: "msg-4", chatId: "chat-1", senderId: "user-2", senderName: "Fatima Ali", content: "Payroll_Report_Dec2024.xlsx", type: "file", fileName: "Payroll_Report_Dec2024.xlsx", fileSize: "2.4 MB", timestamp: "10:28 AM", readBy: ["user-1"] },
  { id: "msg-5", chatId: "chat-1", senderId: "user-2", senderName: "Fatima Ali", content: "Please review the payroll report", type: "text", timestamp: "10:30 AM", readBy: [] },
  
  // Chat 2 - Direct with Hassan
  { id: "msg-6", chatId: "chat-2", senderId: "user-3", senderName: "Hassan Raza", content: "Ahmed, I've updated the production schedule for next week", type: "text", timestamp: "9:30 AM", readBy: ["user-1"] },
  { id: "msg-7", chatId: "chat-2", senderId: "user-1", senderName: "Ahmed Khan", content: "Great! Can you share the updated schedule?", type: "text", timestamp: "9:35 AM", readBy: ["user-3"] },
  { id: "msg-8", chatId: "chat-2", senderId: "user-3", senderName: "Hassan Raza", content: "Production_Schedule_Week52.pdf", type: "file", fileName: "Production_Schedule_Week52.pdf", fileSize: "1.8 MB", timestamp: "9:40 AM", readBy: ["user-1"] },
  { id: "msg-9", chatId: "chat-2", senderId: "user-3", senderName: "Hassan Raza", content: "Production schedule updated ✅", type: "text", timestamp: "9:45 AM", readBy: ["user-1"] },
  
  // Chat 3 - HR Team Group
  { id: "msg-10", chatId: "chat-3", senderId: "user-1", senderName: "Ahmed Khan", content: "Team, we have a meeting scheduled for today", type: "text", timestamp: "10:45 AM", readBy: ["user-6"] },
  { id: "msg-11", chatId: "chat-3", senderId: "user-6", senderName: "Sana Tariq", content: "What time is the meeting? 🕐", type: "text", timestamp: "10:50 AM", readBy: ["user-1"] },
  { id: "msg-12", chatId: "chat-3", senderId: "user-1", senderName: "Ahmed Khan", content: "Meeting at 3 PM today", type: "text", timestamp: "11:00 AM", readBy: [] },
  
  // Chat 4 - Management Team
  { id: "msg-13", chatId: "chat-4", senderId: "user-2", senderName: "Fatima Ali", content: "Good morning everyone! 🌟", type: "text", timestamp: "Yesterday 9:00 AM", readBy: ["user-1", "user-3", "user-4", "user-5"] },
  { id: "msg-14", chatId: "chat-4", senderId: "user-4", senderName: "Ayesha Malik", content: "Morning! Ready for the Q4 review?", type: "text", timestamp: "Yesterday 9:05 AM", readBy: ["user-1", "user-2", "user-3", "user-5"] },
  { id: "msg-15", chatId: "chat-4", senderId: "user-5", senderName: "Usman Sheikh", content: "I've prepared the IT infrastructure report 💻", type: "text", timestamp: "Yesterday 9:10 AM", readBy: ["user-1", "user-2", "user-3", "user-4"] },
  { id: "msg-16", chatId: "chat-4", senderId: "user-1", senderName: "Ahmed Khan", content: "Q4 targets discussion", type: "text", timestamp: "Yesterday 9:15 AM", readBy: ["user-2", "user-3", "user-4", "user-5"] },
  
  // Chat 5 - Broadcast
  { id: "msg-17", chatId: "chat-5", senderId: "user-1", senderName: "Ahmed Khan", content: "📢 Important Announcement", type: "text", timestamp: "Dec 20 10:00 AM", readBy: ["user-2", "user-3", "user-4", "user-5", "user-6", "user-7", "user-8"] },
  { id: "msg-18", chatId: "chat-5", senderId: "user-1", senderName: "Ahmed Khan", content: "Holiday notice for Dec 25", type: "text", timestamp: "Dec 20 10:01 AM", readBy: ["user-2", "user-3", "user-4", "user-5", "user-6", "user-7", "user-8"] },
];

interface ChatStore {
  users: ChatUser[];
  chats: Chat[];
  messages: ChatMessage[];
  currentUserId: string;
  
  // Actions
  sendMessage: (chatId: string, content: string, type?: ChatMessage["type"], fileName?: string, fileSize?: string) => void;
  editMessage: (messageId: string, newContent: string) => void;
  forwardMessage: (messageId: string, toChatId: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
  removeReaction: (messageId: string, emoji: string) => void;
  markAsRead: (chatId: string) => void;
  createGroup: (name: string, participants: string[], description?: string) => void;
  createBroadcast: (name: string, participants: string[], description?: string) => void;
  deleteMessage: (messageId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  users: seedUsers,
  chats: seedChats,
  messages: seedMessages,
  currentUserId: "user-1", // Ahmed Khan is the current user
  
  sendMessage: (chatId, content, type = "text", fileName, fileSize) => {
    const { currentUserId, users } = get();
    const currentUser = users.find(u => u.id === currentUserId);
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatId,
      senderId: currentUserId,
      senderName: currentUser?.name || "Unknown",
      content,
      type,
      fileName,
      fileSize,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      readBy: [],
    };
    
    set(state => ({
      messages: [...state.messages, newMessage],
      chats: state.chats.map(chat => 
        chat.id === chatId 
          ? { ...chat, lastMessage: type === "file" ? `📎 ${fileName}` : content, lastMessageTime: newMessage.timestamp }
          : chat
      ),
    }));
  },
  
  editMessage: (messageId, newContent) => {
    set(state => ({
      messages: state.messages.map(msg =>
        msg.id === messageId ? { ...msg, content: newContent, isEdited: true } : msg
      ),
    }));
  },
  
  forwardMessage: (messageId, toChatId) => {
    const { messages, currentUserId, users } = get();
    const originalMessage = messages.find(m => m.id === messageId);
    const currentUser = users.find(u => u.id === currentUserId);
    
    if (originalMessage) {
      const forwardedMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        chatId: toChatId,
        senderId: currentUserId,
        senderName: currentUser?.name || "Unknown",
        content: originalMessage.content,
        type: originalMessage.type,
        fileName: originalMessage.fileName,
        fileSize: originalMessage.fileSize,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isForwarded: true,
        forwardedFrom: originalMessage.senderName,
        readBy: [],
      };
      
      set(state => ({
        messages: [...state.messages, forwardedMessage],
        chats: state.chats.map(chat =>
          chat.id === toChatId
            ? { ...chat, lastMessage: `↪️ Forwarded: ${originalMessage.content.substring(0, 30)}...`, lastMessageTime: forwardedMessage.timestamp }
            : chat
        ),
      }));
    }
  },
  
  addReaction: (messageId, emoji) => {
    const { currentUserId, users } = get();
    const currentUser = users.find(u => u.id === currentUserId);
    
    set(state => ({
      messages: state.messages.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find(r => r.userId === currentUserId && r.emoji === emoji);
          if (existingReaction) return msg;
          return {
            ...msg,
            reactions: [...reactions, { emoji, userId: currentUserId, userName: currentUser?.name || "Unknown" }],
          };
        }
        return msg;
      }),
    }));
  },
  
  removeReaction: (messageId, emoji) => {
    const { currentUserId } = get();
    set(state => ({
      messages: state.messages.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reactions: (msg.reactions || []).filter(r => !(r.userId === currentUserId && r.emoji === emoji)),
          };
        }
        return msg;
      }),
    }));
  },
  
  markAsRead: (chatId) => {
    const { currentUserId } = get();
    set(state => ({
      messages: state.messages.map(msg =>
        msg.chatId === chatId && !msg.readBy?.includes(currentUserId)
          ? { ...msg, readBy: [...(msg.readBy || []), currentUserId] }
          : msg
      ),
      chats: state.chats.map(chat =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      ),
    }));
  },
  
  createGroup: (name, participants, description) => {
    const { currentUserId, users } = get();
    const currentUserName = users.find(u => u.id === currentUserId)?.name || "Unknown";
    const participantNames = participants.map(p => users.find(u => u.id === p)?.name || "Unknown");
    
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      type: "group",
      name,
      participants: [currentUserId, ...participants],
      participantNames: [currentUserName, ...participantNames],
      lastMessage: "Group created",
      lastMessageTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      unreadCount: 0,
      description,
      isAdmin: [currentUserId],
    };
    
    set(state => ({ chats: [...state.chats, newChat] }));
  },
  
  createBroadcast: (name, participants, description) => {
    const { currentUserId } = get();
    
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      type: "broadcast",
      name,
      participants: [currentUserId, ...participants],
      participantNames: ["All Recipients"],
      lastMessage: "Broadcast created",
      lastMessageTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      unreadCount: 0,
      description,
      createdBy: currentUserId,
      isAdmin: [currentUserId],
    };
    
    set(state => ({ chats: [...state.chats, newChat] }));
  },
  
  deleteMessage: (messageId) => {
    set(state => ({
      messages: state.messages.filter(msg => msg.id !== messageId),
    }));
  },
}));
