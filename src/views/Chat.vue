<template>
  <h1>Chat</h1>
  <div class="chat-container">
    <div v-if="filteredMessages.length > 0">
      <div v-for="(message, index) in filteredMessages" :key="index">
        <div class="message">
          {{ message.senderId }}: {{ message.content }}
          <span class="timestamp">
            ({{ new Date(message.timestamp.seconds * 1000).toLocaleString() }})
          </span>
        </div>
      </div>
    </div>
    <div>
      <label for="userSelect">Select user to send a message: </label>
      <select id="userSelect" v-model="selectedUserId">
        <option disabled value="">Please select a user</option>
        <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
      </select>
    </div>
    <form @submit.prevent="sendMessage">
      <input type="text" v-model="newMessage" />
      <button type="submit" :disabled="!selectedUserId">Send</button>
    </form>
  </div>
</template>

<script>
import { collection, doc, getDocs, getDoc, setDoc, query, orderBy, where } from "firebase/firestore";
import { auth, db } from '../firebase/firebase';

export default {
  data() {
    return {
      newMessage: "",
      conversations: [],
      selectedUserId: "",
      users: [],
    };
  },

  computed: {
    filteredMessages() {
      if (!this.selectedUserId || this.conversations.length === 0) {
        return [];
      }
      
      const selectedConversation = this.conversations.find(conversation => {
        return conversation.participants && conversation.participants.includes(this.selectedUserId);
      });

      return selectedConversation ? selectedConversation.messages : [];
    },
  },

  async created() {
    const loggedInUser = auth.currentUser;

    console.log("Logged-in user:", loggedInUser);

    await this.fetchAndInitializeConversations();
    await this.fetchUsers();
  },

  methods: {
    async fetchUsers() {
      const loggedInUserId = auth.currentUser.uid;
      const usersSnapshot = await getDocs(collection(db, "users"));

      usersSnapshot.forEach((userDoc) => {
        if (userDoc.id !== loggedInUserId) {
          this.users.push({
            id: userDoc.id,
            name: userDoc.data().name,
          });
        }
      });
    },

    async fetchAndInitializeConversations() {
      const loggedInUserId = auth.currentUser.uid;
      const userConversationsSnapshot = await getDocs(
        query(collection(db, "conversations"), where("participants", "array-contains", loggedInUserId))
      );

      for (const conversationDoc of userConversationsSnapshot.docs) {
        const participants = conversationDoc.data().participants;
        const otherUserId = participants.find((id) => id !== loggedInUserId);

        const otherUserDoc = await getDoc(doc(db, "users", otherUserId));

        const messagesMap = conversationDoc.data().messages;
        const messages = Object.values(messagesMap).map((messageData) => {
          return {
            id: messageData.id,
            content: messageData.content,
            senderId: messageData.senderId,
            timestamp: messageData.timestamp,
          };
        });

        this.conversations.push({
          id: conversationDoc.id,
          displayName: otherUserDoc.data().name,
          messages: messages,
        });
      }
    },

    async sendMessage() {
      if (!this.selectedUserId || !this.newMessage.trim()) {
        return;
      }
      const loggedInUserId = auth.currentUser.uid;
  const conversationId = this.getConversationId(loggedInUserId, this.selectedUserId);
  const message = {
    content: this.newMessage,
    senderId: loggedInUserId,
    timestamp: new Date(),
    id: Date.now().toString(),
  };

  const conversationRef = doc(db, "conversations", conversationId);
  const conversationSnapshot = await getDoc(conversationRef);

  if (conversationSnapshot.exists()) {
    const currentMessages = conversationSnapshot.data().messages || {};
    await setDoc(conversationRef, {
      participants: conversationSnapshot.data().participants,
      messages: { ...currentMessages, [message.id]: message },
    });
  } else {
    await setDoc(conversationRef, {
      participants: [loggedInUserId, this.selectedUserId],
      messages: { [message.id]: message },
    });
  }

  this.newMessage = '';
  await this.fetchAndInitializeConversations();
},

getConversationId(user1, user2) {
  const ids = [user1, user2].sort();
  return `${ids[0]}_${ids[1]}`;
},

formatDate(timestamp) {
  const date = new Date(timestamp.toDate());
  return date.toLocaleString();
},
},
};
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #f8f8f8;
  border-radius: 4px;
}

.message {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timestamp {
  font-size: 0.8rem;
  color: #777;
  margin-left: 1rem;
}

form {
  display: flex;
  margin-top: 1rem;
}

input[type="text"] {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button[type="submit"] {
  margin-left: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"]:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>