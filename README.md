# 📡 Chat App Socket Events Guide

This document outlines the real-time socket events and essential APIs used in the chat application. It includes details about client-side events, server responses, and REST endpoints.

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

## 🔗 API Reference

### 📬 `POST /group/check-personal-group`

### Description  
This API checks if a personal chat room exists between two users. If not, it creates a new one.

### 🧾 Expected Payload
```json
{
  "users": [
    { "id": "987654321098765432101235", "name": "Poshan Soneshwari" },
    { "id": "987654321098765432101236", "name": "amit Kumar" }
  ]
}
```

### ✅ Response Sample
```json
{
  "status": "success",
  "isCreated": false,
  "groupData": {
    "name": "Amit Kumar",
    "userNames": [ "Poshan Soneshwari", "Amit Kumar" ],
    "isPersonal": true,
    "lastMessageId": null,
    "users": [ "987654321098765432101235", "987654321098765432101236" ],
    "_id": "67f9f388d9e3c45c46f9bf38",
    "createdAt": "2025-04-12T05:00:56.563Z",
    "updatedAt": "2025-04-12T05:00:56.563Z"
  }
}
```

### 📡 Socket Notification  
Once a personal group is created or found, the socket server emits an `onRoomCreated` event.

#### 📨 Event Payload
```json
{
  "from": "socket",
  "group": {
    "name": "Amit Kumar",
    "userNames": [ "Poshan Soneshwari", "Amit Kumar" ],
    "isPersonal": true,
    "lastMessageId": null,
    "users": [ "987654321098765432101235", "987654321098765432101236" ],
    "_id": "67f9f388d9e3c45c46f9bf38",
    "createdAt": "2025-04-12T05:00:56.563Z",
    "updatedAt": "2025-04-12T05:00:56.563Z"
  }
}
```

---

## 📌 Notes

- All socket events must be handled over an active WebSocket connection.
- API calls and socket events work in tandem to deliver real-time chat experiences.
- Be sure to subscribe to the relevant events (`onTyping`, `onMessage`, `onRoomCreated`) after establishing the socket connection.

---

Let me know if you want to add authentication notes, group message history fetching, or user presence features!