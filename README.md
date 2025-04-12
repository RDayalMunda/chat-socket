# 📡 Chat App Socket Events Guide

This document outlines the real-time socket events used in the chat application. It includes details about the events the client emits and listens to, along with example payloads and responses.

---

## ✍️ `typing` Event

### Description  
Triggered when a user is actively typing a message in a group chat. It allows other participants in the same group to see a typing indicator in real-time.

### 🔁 Emitted By:  
**Client**

### 📤 Payload
```json
{
  "groupId": "67f0d5e6d76e993cceea6548",
  "senderId": "987654321098765432101234",
  "senderName": "Ram Dayal"
}
```

### 📥 Listened On:  
**`onTyping`**

### 📨 Response Sample
```json
{
  "from": "socket",
  "typing": {
    "groupId": "67f0d5e6d76e993cceea6548",
    "senderId": "987654321098765432101234",
    "senderName": "Ram Dayal"
  }
}
```

---

## 💬 `message` Event

### Description  
Used when a user sends a message in a group chat. Other participants will receive this message in real-time.

### 🔁 Emitted By:  
**Client**

### 📤 Payload
```json
{
  "content": "messageContent.value",
  "groupId": "groupId.value",
  "senderId": "987654321098765432101234",
  "senderName": "Ram Dayal"
}
```

### 📥 Listened On:  
**`onMessage`**

### 📨 Response Sample
```json
{
  "from": "socket",
  "message": {
    "_id": "67f9ef6fb1cb2219f740bb6c",
    "content": "some message user has typed",
    "senderId": "987654321098765432101234",
    "senderName": "Ram Dayal",
    "groupId": "67f0d5e6d76e993cceea6548",
    "createdAt": "2025-04-12T04:43:27.072Z",
    "updatedAt": "2025-04-12T04:43:27.072Z"
  }
}
```

---

## 📌 Notes

- All events are expected to be handled over a persistent WebSocket connection.
- Be sure to properly bind listeners (`onTyping`, `onMessage`, etc.) to ensure real-time updates in the chat interface.
- Payload properties like `groupId`, `senderId`, and `senderName` must be accurate and up-to-date for proper event propagation.

---

Let me know if you want to include more events or add a section for connection handling, error handling, or user presence tracking.