"use client";

import { useState, useRef, useEffect } from "react";
import {
  Drawer, Input, Button, Avatar, Badge, Tabs, List, Typography, Tag, Tooltip, Dropdown, Modal, Form, Select, Popover, Space,
} from "antd";
import {
  MessageOutlined, SendOutlined, SmileOutlined, PaperClipOutlined, UserOutlined, TeamOutlined, SoundOutlined,
  EditOutlined, DeleteOutlined, ForwardOutlined, MoreOutlined, PlusOutlined, SearchOutlined, CheckOutlined, CheckCircleOutlined,
} from "@ant-design/icons";
import { useChatStore } from "@/store/chatStore";
import { Chat, ChatMessage } from "@/types/chat";

const { Text } = Typography;

const EMOJI_LIST = ["👍", "❤️", "😂", "😮", "😢", "🎉", "🔥", "👏", "💯", "✅", "❌", "🙏", "💪", "🤔", "👋", "🎯"];

// EmojiPicker component defined outside the main component
const EmojiPicker = ({ onSelect }: { onSelect: (emoji: string) => void }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4, padding: 8 }}>
    {EMOJI_LIST.map(emoji => (
      <Button key={emoji} type="text" size="small" onClick={() => onSelect(emoji)} style={{ fontSize: 16, padding: 4 }}>
        {emoji}
      </Button>
    ))}
  </div>
);

export default function ChatModule() {
  const [open, setOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [editContent, setEditContent] = useState("");
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [forwardingMessage, setForwardingMessage] = useState<ChatMessage | null>(null);
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [createBroadcastModal, setCreateBroadcastModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();

  const { users, chats, messages, currentUserId, sendMessage, editMessage, forwardMessage, addReaction, markAsRead, createGroup, createBroadcast, deleteMessage } = useChatStore();

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedChat) scrollToBottom();
  }, [messages, selectedChat]);

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "direct") return chat.type === "direct" && matchesSearch;
    if (activeTab === "groups") return chat.type === "group" && matchesSearch;
    if (activeTab === "broadcast") return chat.type === "broadcast" && matchesSearch;
    return matchesSearch;
  });

  const chatMessages = selectedChat ? messages.filter(m => m.chatId === selectedChat.id) : [];

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    sendMessage(selectedChat.id, messageInput.trim());
    setMessageInput("");
  };

  const handleEditSave = () => {
    if (editingMessage && editContent.trim()) {
      editMessage(editingMessage.id, editContent.trim());
      setEditingMessage(null);
      setEditContent("");
    }
  };

  const handleForward = (chatId: string) => {
    if (forwardingMessage) {
      forwardMessage(forwardingMessage.id, chatId);
      setForwardModalOpen(false);
      setForwardingMessage(null);
    }
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    markAsRead(chat.id);
  };

  const handleCreateGroup = (values: { name: string; participants: string[]; description?: string }) => {
    createGroup(values.name, values.participants, values.description);
    setCreateGroupModal(false);
    form.resetFields();
  };

  const handleCreateBroadcast = (values: { name: string; participants: string[]; description?: string }) => {
    createBroadcast(values.name, values.participants, values.description);
    setCreateBroadcastModal(false);
    form.resetFields();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = { online: "#52c41a", away: "#faad14", busy: "#ff4d4f", offline: "#8c8c8c" };
    return colors[status] || "#8c8c8c";
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.type === "direct") {
      const otherUserId = chat.participants.find(p => p !== currentUserId);
      const otherUser = users.find(u => u.id === otherUserId);
      return (
        <Badge dot color={getStatusColor(otherUser?.status || "offline")} offset={[-4, 28]}>
          <Avatar style={{ background: "#00BFFF" }}>{chat.name.charAt(0)}</Avatar>
        </Badge>
      );
    }
    if (chat.type === "group") return <Avatar style={{ background: "#722ed1" }} icon={<TeamOutlined />} />;
    return <Avatar style={{ background: "#faad14" }} icon={<SoundOutlined />} />;
  };

  const MessageItem = ({ msg }: { msg: ChatMessage }) => {
    const isOwn = msg.senderId === currentUserId;
    
    const messageActions = [
      { key: "react", label: "React", icon: <SmileOutlined /> },
      { key: "forward", label: "Forward", icon: <ForwardOutlined /> },
      ...(isOwn ? [
        { key: "edit", label: "Edit", icon: <EditOutlined /> },
        { key: "delete", label: "Delete", icon: <DeleteOutlined />, danger: true },
      ] : []),
    ];

    const handleAction = (key: string) => {
      if (key === "edit") { setEditingMessage(msg); setEditContent(msg.content); }
      if (key === "forward") { setForwardingMessage(msg); setForwardModalOpen(true); }
      if (key === "delete") deleteMessage(msg.id);
    };

    return (
      <div style={{ display: "flex", justifyContent: isOwn ? "flex-end" : "flex-start", marginBottom: 12 }}>
        <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start" }}>
          {!isOwn && <Text style={{ fontSize: 11, color: "#8c8c8c", marginBottom: 2 }}>{msg.senderName}</Text>}
          {msg.isForwarded && (
            <Text style={{ fontSize: 10, color: "#8c8c8c", fontStyle: "italic" }}>↪️ Forwarded from {msg.forwardedFrom}</Text>
          )}
          <div
            style={{
              background: isOwn ? "linear-gradient(135deg, #00BFFF 0%, #0099cc 100%)" : "#f0f2f5",
              color: isOwn ? "#fff" : "#000",
              padding: "8px 12px",
              borderRadius: isOwn ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
              position: "relative",
            }}
          >
            {msg.type === "file" ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <PaperClipOutlined />
                <div>
                  <Text style={{ color: isOwn ? "#fff" : "#000", display: "block" }}>{msg.fileName}</Text>
                  <Text style={{ fontSize: 10, color: isOwn ? "rgba(255,255,255,0.7)" : "#8c8c8c" }}>{msg.fileSize}</Text>
                </div>
              </div>
            ) : (
              <Text style={{ color: isOwn ? "#fff" : "#000" }}>{msg.content}</Text>
            )}
            {msg.isEdited && <Text style={{ fontSize: 9, color: isOwn ? "rgba(255,255,255,0.6)" : "#8c8c8c", marginLeft: 4 }}>(edited)</Text>}
            
            <Dropdown menu={{ items: messageActions, onClick: ({ key }) => handleAction(key) }} trigger={["click"]}>
              <Button type="text" size="small" icon={<MoreOutlined />} style={{ position: "absolute", top: 2, right: 2, color: isOwn ? "#fff" : "#8c8c8c", opacity: 0.6 }} />
            </Dropdown>
          </div>
          
          {/* Reactions */}
          {msg.reactions && msg.reactions.length > 0 && (
            <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
              {Array.from(new Set(msg.reactions.map(r => r.emoji))).map(emoji => {
                const count = msg.reactions!.filter(r => r.emoji === emoji).length;
                return (
                  <Tooltip key={emoji} title={msg.reactions!.filter(r => r.emoji === emoji).map(r => r.userName).join(", ")}>
                    <Tag style={{ cursor: "pointer", fontSize: 12 }} onClick={() => addReaction(msg.id, emoji)}>
                      {emoji} {count > 1 && count}
                    </Tag>
                  </Tooltip>
                );
              })}
            </div>
          )}
          
          {/* Quick emoji reactions */}
          <Popover content={<EmojiPicker onSelect={(emoji) => addReaction(msg.id, emoji)} />} trigger="click">
            <Button type="text" size="small" icon={<SmileOutlined />} style={{ marginTop: 2, fontSize: 10, color: "#8c8c8c" }} />
          </Popover>
          
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
            <Text style={{ fontSize: 10, color: "#8c8c8c" }}>{msg.timestamp}</Text>
            {isOwn && (
              <span style={{ color: msg.readBy && msg.readBy.length > 0 ? "#00BFFF" : "#8c8c8c" }}>
                {msg.readBy && msg.readBy.length > 0 ? <CheckCircleOutlined style={{ fontSize: 10 }} /> : <CheckOutlined style={{ fontSize: 10 }} />}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Tooltip title="Messages">
        <Badge count={totalUnread} size="small" offset={[-2, 2]}>
          <Button type="text" icon={<MessageOutlined style={{ fontSize: 18 }} />} onClick={() => setOpen(true)} style={{ color: "#fff" }} />
        </Badge>
      </Tooltip>

      <Drawer
        title={selectedChat ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button type="text" onClick={() => setSelectedChat(null)} style={{ padding: 0 }}>←</Button>
            {getChatAvatar(selectedChat)}
            <div>
              <Text strong>{selectedChat.name}</Text>
              <Text style={{ display: "block", fontSize: 11, color: "#8c8c8c" }}>
                {selectedChat.type === "direct" ? users.find(u => u.id === selectedChat.participants.find(p => p !== currentUserId))?.status : `${selectedChat.participants.length} members`}
              </Text>
            </div>
          </div>
        ) : "Messages"}
        placement="right"
        open={open}
        onClose={() => { setOpen(false); setSelectedChat(null); }}
        styles={{ 
          body: { padding: 0, display: "flex", flexDirection: "column", height: "100%" },
          header: { padding: "16px 20px" },
        }}
        width={400}
        className="chat-drawer"
      >
        {!selectedChat ? (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Search and Actions */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
              <Input prefix={<SearchOutlined />} placeholder="Search chats..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ marginBottom: 12 }} />
              <Space>
                <Button size="small" icon={<PlusOutlined />} onClick={() => setCreateGroupModal(true)}>New Group</Button>
                <Button size="small" icon={<SoundOutlined />} onClick={() => setCreateBroadcastModal(true)}>Broadcast</Button>
              </Space>
            </div>
            
            {/* Tabs */}
            <Tabs activeKey={activeTab} onChange={setActiveTab} centered size="small" items={[
              { key: "all", label: "All" },
              { key: "direct", label: <><UserOutlined /> Direct</> },
              { key: "groups", label: <><TeamOutlined /> Groups</> },
              { key: "broadcast", label: <><SoundOutlined /> Broadcast</> },
            ]} style={{ padding: "0 20px" }} />
            
            {/* Chat List */}
            <List
              style={{ flex: 1, overflow: "auto" }}
              dataSource={filteredChats}
              renderItem={chat => (
                <List.Item onClick={() => handleSelectChat(chat)} style={{ padding: "12px 20px", cursor: "pointer", background: chat.unreadCount > 0 ? "#f6ffed" : "transparent" }}>
                  <List.Item.Meta
                    avatar={getChatAvatar(chat)}
                    title={<div style={{ display: "flex", justifyContent: "space-between" }}>
                      <Text strong style={{ fontSize: 13 }}>{chat.name}</Text>
                      <Text style={{ fontSize: 11, color: "#8c8c8c" }}>{chat.lastMessageTime}</Text>
                    </div>}
                    description={<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Text ellipsis style={{ fontSize: 12, color: "#8c8c8c", maxWidth: 180 }}>{chat.lastMessage}</Text>
                      {chat.unreadCount > 0 && <Badge count={chat.unreadCount} style={{ background: "#00BFFF" }} />}
                    </div>}
                  />
                </List.Item>
              )}
            />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Messages */}
            <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
              {chatMessages.map(msg => <MessageItem key={msg.id} msg={msg} />)}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div style={{ padding: "12px 20px", borderTop: "1px solid #f0f0f0", background: "#fafafa" }}>
              {editingMessage ? (
                <div style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 11, color: "#8c8c8c" }}>Editing message</Text>
                  <Input.TextArea value={editContent} onChange={e => setEditContent(e.target.value)} autoSize={{ minRows: 1, maxRows: 3 }} />
                  <Space style={{ marginTop: 8 }}>
                    <Button size="small" onClick={() => setEditingMessage(null)}>Cancel</Button>
                    <Button size="small" type="primary" onClick={handleEditSave}>Save</Button>
                  </Space>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <Popover content={<EmojiPicker onSelect={(emoji) => setMessageInput(prev => prev + emoji)} />} trigger="click">
                    <Button type="text" icon={<SmileOutlined />} />
                  </Popover>
                  <Button type="text" icon={<PaperClipOutlined />} onClick={() => sendMessage(selectedChat.id, "Document.pdf", "file", "Document.pdf", "1.2 MB")} />
                  <Input.TextArea
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onPressEnter={e => { if (!e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                    placeholder="Type a message..."
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    style={{ flex: 1 }}
                  />
                  <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage} disabled={!messageInput.trim()} />
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Forward Modal */}
      <Modal title="Forward Message" open={forwardModalOpen} onCancel={() => setForwardModalOpen(false)} footer={null}>
        <List
          dataSource={chats.filter(c => c.id !== selectedChat?.id)}
          renderItem={chat => (
            <List.Item onClick={() => handleForward(chat.id)} style={{ cursor: "pointer" }}>
              <List.Item.Meta avatar={getChatAvatar(chat)} title={chat.name} description={chat.type} />
            </List.Item>
          )}
        />
      </Modal>

      {/* Create Group Modal */}
      <Modal title="Create Group" open={createGroupModal} onCancel={() => setCreateGroupModal(false)} onOk={() => form.submit()} okText="Create">
        <Form form={form} layout="vertical" onFinish={handleCreateGroup}>
          <Form.Item name="name" label="Group Name" rules={[{ required: true }]}>
            <Input placeholder="Enter group name" />
          </Form.Item>
          <Form.Item name="participants" label="Add Members" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="Select members" options={users.filter(u => u.id !== currentUserId).map(u => ({ value: u.id, label: `${u.name} (${u.department})` }))} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Group description (optional)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Broadcast Modal */}
      <Modal title="Create Broadcast" open={createBroadcastModal} onCancel={() => setCreateBroadcastModal(false)} onOk={() => form.submit()} okText="Create">
        <Form form={form} layout="vertical" onFinish={handleCreateBroadcast}>
          <Form.Item name="name" label="Broadcast Name" rules={[{ required: true }]}>
            <Input placeholder="Enter broadcast name" />
          </Form.Item>
          <Form.Item name="participants" label="Recipients" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="Select recipients" options={users.filter(u => u.id !== currentUserId).map(u => ({ value: u.id, label: `${u.name} (${u.department})` }))} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Broadcast description (optional)" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
