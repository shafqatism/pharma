"use client";

import { useState, useRef, useEffect } from "react";
import {
  Input, Button, Avatar, Badge, Tabs, List, Typography, Tag, Tooltip, Dropdown, Modal, Form, Select, Popover, Space, Empty,
} from "antd";
import {
  SendOutlined, SmileOutlined, PaperClipOutlined, TeamOutlined, SoundOutlined,
  EditOutlined, DeleteOutlined, ForwardOutlined, MoreOutlined, SearchOutlined, CheckOutlined, CheckCircleOutlined, InfoCircleOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import { useChatStore } from "@/store/chatStore";
import { Chat, ChatMessage } from "@/types/chat";

const { Text, Title } = Typography;

const EMOJI_LIST = ["👍", "❤️", "😂", "😮", "😢", "🎉", "🔥", "👏", "💯", "✅", "❌", "🙏", "💪", "🤔", "👋", "🎯"];

const EmojiPicker = ({ onSelect }: { onSelect: (emoji: string) => void }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4, padding: 8 }}>
    {EMOJI_LIST.map(emoji => (
      <Button key={emoji} type="text" size="small" onClick={() => onSelect(emoji)} style={{ fontSize: 16, padding: 4 }}>
        {emoji}
      </Button>
    ))}
  </div>
);

export default function ChatPage() {
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
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();

  const { users, chats, messages, currentUserId, sendMessage, editMessage, forwardMessage, addReaction, markAsRead, createGroup, createBroadcast, deleteMessage } = useChatStore();

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
    setShowInfo(false);
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

  const getChatAvatar = (chat: Chat, size: number = 40) => {
    if (chat.type === "direct") {
      const otherUserId = chat.participants.find(p => p !== currentUserId);
      const otherUser = users.find(u => u.id === otherUserId);
      return (
        <Badge dot color={getStatusColor(otherUser?.status || "offline")} offset={[-4, size - 8]}>
          <Avatar size={size} style={{ background: "#00BFFF" }}>{chat.name.charAt(0)}</Avatar>
        </Badge>
      );
    }
    if (chat.type === "group") return <Avatar size={size} style={{ background: "#722ed1" }} icon={<TeamOutlined />} />;
    return <Avatar size={size} style={{ background: "#faad14" }} icon={<SoundOutlined />} />;
  };

  const MessageItem = ({ msg }: { msg: ChatMessage }) => {
    const isOwn = msg.senderId === currentUserId;
    
    const messageActions = [
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
      <div style={{ display: "flex", justifyContent: isOwn ? "flex-end" : "flex-start", marginBottom: 16, padding: "0 16px" }}>
        <div style={{ maxWidth: "65%", display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start" }}>
          {!isOwn && <Text style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 4 }}>{msg.senderName}</Text>}
          {msg.isForwarded && (
            <Text style={{ fontSize: 11, color: "#8c8c8c", fontStyle: "italic", marginBottom: 2 }}>↪️ Forwarded from {msg.forwardedFrom}</Text>
          )}
          <div
            style={{
              background: isOwn ? "linear-gradient(135deg, #00BFFF 0%, #0099cc 100%)" : "#f5f5f5",
              color: isOwn ? "#fff" : "#000",
              padding: "10px 14px",
              borderRadius: isOwn ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              position: "relative",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            {msg.type === "file" ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <PaperClipOutlined style={{ fontSize: 18 }} />
                <div>
                  <Text style={{ color: isOwn ? "#fff" : "#000", display: "block", fontWeight: 500 }}>{msg.fileName}</Text>
                  <Text style={{ fontSize: 11, color: isOwn ? "rgba(255,255,255,0.7)" : "#8c8c8c" }}>{msg.fileSize}</Text>
                </div>
              </div>
            ) : (
              <Text style={{ color: isOwn ? "#fff" : "#000", fontSize: 14 }}>{msg.content}</Text>
            )}
            {msg.isEdited && <Text style={{ fontSize: 10, color: isOwn ? "rgba(255,255,255,0.6)" : "#8c8c8c", marginLeft: 6 }}>(edited)</Text>}
            
            <Dropdown menu={{ items: messageActions, onClick: ({ key }) => handleAction(key) }} trigger={["click"]}>
              <Button type="text" size="small" icon={<MoreOutlined />} style={{ position: "absolute", top: 4, right: 4, color: isOwn ? "#fff" : "#8c8c8c", opacity: 0.7 }} />
            </Dropdown>
          </div>
          
          {/* Reactions */}
          {msg.reactions && msg.reactions.length > 0 && (
            <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
              {Array.from(new Set(msg.reactions.map(r => r.emoji))).map(emoji => {
                const count = msg.reactions!.filter(r => r.emoji === emoji).length;
                return (
                  <Tooltip key={emoji} title={msg.reactions!.filter(r => r.emoji === emoji).map(r => r.userName).join(", ")}>
                    <Tag style={{ cursor: "pointer", fontSize: 13, borderRadius: 12 }} onClick={() => addReaction(msg.id, emoji)}>
                      {emoji} {count > 1 && count}
                    </Tag>
                  </Tooltip>
                );
              })}
            </div>
          )}
          
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <Popover content={<EmojiPicker onSelect={(emoji) => addReaction(msg.id, emoji)} />} trigger="click">
              <Button type="text" size="small" icon={<SmileOutlined />} style={{ fontSize: 11, color: "#8c8c8c", padding: "0 4px", height: 20 }} />
            </Popover>
            <Text style={{ fontSize: 11, color: "#8c8c8c" }}>{msg.timestamp}</Text>
            {isOwn && (
              <span style={{ color: msg.readBy && msg.readBy.length > 0 ? "#00BFFF" : "#8c8c8c" }}>
                {msg.readBy && msg.readBy.length > 0 ? <CheckCircleOutlined style={{ fontSize: 11 }} /> : <CheckOutlined style={{ fontSize: 11 }} />}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div style={{ margin: -20, height: "calc(100vh - 84px)", display: "flex", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid #e8e8e8" }}>
        {/* Chat List Sidebar */}
        <div style={{ width: 320, borderRight: "1px solid #e8e8e8", display: "flex", flexDirection: "column", background: "#fafafa" }}>
          {/* Header */}
          <div style={{ padding: 16, borderBottom: "1px solid #e8e8e8", background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Title level={5} style={{ margin: 0 }}>Messages</Title>
              <Space>
                <Tooltip title="New Group">
                  <Button type="text" size="small" icon={<TeamOutlined />} onClick={() => setCreateGroupModal(true)} />
                </Tooltip>
                <Tooltip title="Broadcast">
                  <Button type="text" size="small" icon={<SoundOutlined />} onClick={() => setCreateBroadcastModal(true)} />
                </Tooltip>
              </Space>
            </div>
            <Input prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />} placeholder="Search conversations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ borderRadius: 20 }} />
          </div>
          
          {/* Tabs */}
          <Tabs activeKey={activeTab} onChange={setActiveTab} centered size="small" items={[
            { key: "all", label: "All" },
            { key: "direct", label: "Direct" },
            { key: "groups", label: "Groups" },
            { key: "broadcast", label: "Broadcast" },
          ]} style={{ padding: "0 8px", background: "#fff" }} />
          
          {/* Chat List */}
          <div style={{ flex: 1, overflow: "auto" }}>
            <List
              dataSource={filteredChats}
              renderItem={chat => (
                <div
                  onClick={() => handleSelectChat(chat)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    background: selectedChat?.id === chat.id ? "#e6f7ff" : chat.unreadCount > 0 ? "#f6ffed" : "transparent",
                    borderLeft: selectedChat?.id === chat.id ? "3px solid #00BFFF" : "3px solid transparent",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {getChatAvatar(chat)}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Text strong style={{ fontSize: 13 }}>{chat.name}</Text>
                        <Text style={{ fontSize: 11, color: "#8c8c8c" }}>{chat.lastMessageTime}</Text>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                        <Text ellipsis style={{ fontSize: 12, color: "#8c8c8c", maxWidth: 180 }}>{chat.lastMessage}</Text>
                        {chat.unreadCount > 0 && <Badge count={chat.unreadCount} style={{ background: "#00BFFF" }} />}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff" }}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: "12px 20px", borderBottom: "1px solid #e8e8e8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {getChatAvatar(selectedChat, 44)}
                  <div>
                    <Text strong style={{ fontSize: 15 }}>{selectedChat.name}</Text>
                    <Text style={{ display: "block", fontSize: 12, color: "#8c8c8c" }}>
                      {selectedChat.type === "direct" 
                        ? users.find(u => u.id === selectedChat.participants.find(p => p !== currentUserId))?.status 
                        : `${selectedChat.participants.length} members`}
                    </Text>
                  </div>
                </div>
                <Space>
                  <Tooltip title="Chat Info">
                    <Button type="text" icon={<InfoCircleOutlined />} onClick={() => setShowInfo(!showInfo)} />
                  </Tooltip>
                </Space>
              </div>

              <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* Messages Area */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ flex: 1, overflow: "auto", padding: "16px 0", background: "#f9f9f9" }}>
                    {chatMessages.map(msg => <MessageItem key={msg.id} msg={msg} />)}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Input Area */}
                  <div style={{ padding: 16, borderTop: "1px solid #e8e8e8", background: "#fff" }}>
                    {editingMessage ? (
                      <div>
                        <Text style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 8, display: "block" }}>✏️ Editing message</Text>
                        <Input.TextArea value={editContent} onChange={e => setEditContent(e.target.value)} autoSize={{ minRows: 1, maxRows: 4 }} style={{ marginBottom: 8 }} />
                        <Space>
                          <Button size="small" onClick={() => setEditingMessage(null)}>Cancel</Button>
                          <Button size="small" type="primary" onClick={handleEditSave}>Save Changes</Button>
                        </Space>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                        <Popover content={<EmojiPicker onSelect={(emoji) => setMessageInput(prev => prev + emoji)} />} trigger="click">
                          <Button type="text" icon={<SmileOutlined style={{ fontSize: 20 }} />} style={{ color: "#8c8c8c" }} />
                        </Popover>
                        <Button type="text" icon={<PaperClipOutlined style={{ fontSize: 20 }} />} style={{ color: "#8c8c8c" }} onClick={() => sendMessage(selectedChat.id, "Document.pdf", "file", "Document.pdf", "1.2 MB")} />
                        <Input.TextArea
                          value={messageInput}
                          onChange={e => setMessageInput(e.target.value)}
                          onPressEnter={e => { if (!e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                          placeholder="Type a message..."
                          autoSize={{ minRows: 1, maxRows: 4 }}
                          style={{ flex: 1, borderRadius: 20, padding: "8px 16px" }}
                        />
                        <Button type="primary" shape="circle" icon={<SendOutlined />} onClick={handleSendMessage} disabled={!messageInput.trim()} style={{ background: "#00BFFF", borderColor: "#00BFFF" }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Panel */}
                {showInfo && (
                  <div style={{ width: 280, borderLeft: "1px solid #e8e8e8", padding: 16, overflow: "auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                      {getChatAvatar(selectedChat, 80)}
                      <Title level={5} style={{ marginTop: 12, marginBottom: 4 }}>{selectedChat.name}</Title>
                      <Tag color={selectedChat.type === "direct" ? "blue" : selectedChat.type === "group" ? "purple" : "orange"}>
                        {selectedChat.type.toUpperCase()}
                      </Tag>
                    </div>
                    {selectedChat.description && (
                      <div style={{ marginBottom: 16 }}>
                        <Text strong style={{ fontSize: 12, color: "#8c8c8c" }}>Description</Text>
                        <Text style={{ display: "block", marginTop: 4 }}>{selectedChat.description}</Text>
                      </div>
                    )}
                    <div>
                      <Text strong style={{ fontSize: 12, color: "#8c8c8c" }}>Members ({selectedChat.participants.length})</Text>
                      <List
                        size="small"
                        dataSource={selectedChat.participants}
                        renderItem={pId => {
                          const user = users.find(u => u.id === pId);
                          return user ? (
                            <List.Item style={{ padding: "8px 0" }}>
                              <List.Item.Meta
                                avatar={<Badge dot color={getStatusColor(user.status)} offset={[-4, 28]}><Avatar size={32}>{user.name.charAt(0)}</Avatar></Badge>}
                                title={<Text style={{ fontSize: 13 }}>{user.name}</Text>}
                                description={<Text style={{ fontSize: 11, color: "#8c8c8c" }}>{user.designation}</Text>}
                              />
                            </List.Item>
                          ) : null;
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9" }}>
              <Empty description="Select a conversation to start messaging" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          )}
        </div>
      </div>

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
      <Modal title="Create New Group" open={createGroupModal} onCancel={() => setCreateGroupModal(false)} onOk={() => form.submit()} okText="Create Group">
        <Form form={form} layout="vertical" onFinish={handleCreateGroup}>
          <Form.Item name="name" label="Group Name" rules={[{ required: true, message: "Please enter group name" }]}>
            <Input placeholder="Enter group name" />
          </Form.Item>
          <Form.Item name="participants" label="Add Members" rules={[{ required: true, message: "Please select members" }]}>
            <Select mode="multiple" placeholder="Select members" options={users.filter(u => u.id !== currentUserId).map(u => ({ value: u.id, label: `${u.name} (${u.department})` }))} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Group description (optional)" rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Broadcast Modal */}
      <Modal title="Create Broadcast List" open={createBroadcastModal} onCancel={() => setCreateBroadcastModal(false)} onOk={() => form.submit()} okText="Create Broadcast">
        <Form form={form} layout="vertical" onFinish={handleCreateBroadcast}>
          <Form.Item name="name" label="Broadcast Name" rules={[{ required: true, message: "Please enter broadcast name" }]}>
            <Input placeholder="Enter broadcast name" />
          </Form.Item>
          <Form.Item name="participants" label="Recipients" rules={[{ required: true, message: "Please select recipients" }]}>
            <Select mode="multiple" placeholder="Select recipients" options={users.filter(u => u.id !== currentUserId).map(u => ({ value: u.id, label: `${u.name} (${u.department})` }))} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Broadcast description (optional)" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  );
}
