<template>
  <h1>Chat</h1>
  <div class="chat-container">
    <div>
      <label for="userSelect">Select user to send a message: </label>
      <select id="userSelect" v-model="selectedUserEmail">
        <option disabled value="">Please select a user</option>
        <option v-for="user in users" :key="user.email" :value="user.email">{{ user.name }}</option>
      </select>
    </div>
    <div v-if="filteredMessages.length > 0">
      <div v-for="(message, index) in filteredMessages" :key="index" :class="{ 'sent-by-me': isSentByMe(message) }">
        <div class="message">
          {{ message.senderEmail }}: {{ message.content }}
          <span class="timestamp">
            ({{ new Date(message.timestamp.seconds * 1000).toLocaleString() }})
          </span>
        </div>
      </div>
    </div>
    <form @submit.prevent="sendMessage">
      <input type="text" v-model="newMessage" />
      <button type="submit" :disabled="!selectedUserEmail">Send</button>
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
      selectedUserEmail: "",
      users: [],
    };
  },

  computed: {
    filteredMessages() {
      if (!this.selectedUserEmail || this.conversations.length === 0) {
        return [];
      }
      
      const selectedConversation = this.conversations.find(conversation => {
        return conversation.participants && conversation.participants.includes(this.selectedUserEmail);
      });

      return selectedConversation ? selectedConversation.messages : [];
    },
  },

  async created() {
    const loggedInUser = auth.currentUser;

    console.log("Logged-in user:", loggedInUser);

    await this.fetchUsers();
    await this.fetchAndInitializeConversations();
  },

  methods: {
    async fetchUsers() {
      const loggedInUserEmail = auth.currentUser.email;
      const usersSnapshot = await getDocs(collection(db, "users"));

      usersSnapshot.forEach((userDoc) => {
        if (userDoc.data().email !== loggedInUserEmail) {
          this.users.push({
            email: userDoc.data().email,
            name: userDoc.data().name,
          });
        }
      });
    },

    async fetchAndInitializeConversations() {
      const loggedInUserEmail = auth.currentUser.email;
      const userConversationsSnapshot = await getDocs(
        query(collection(db, "conversations"), where("participants", "array-contains", loggedInUserEmail))
      );

      for (const conversationDoc of userConversationsSnapshot.docs) {
        const participants = conversationDoc.data().participants;
        const otherUserEmail = participants.find((email) => email !== loggedInUserEmail);

        const otherUser = this.users.find(user => user.email === otherUserEmail);

        const messagesMap = conversationDoc.data().messages;
        const messages = Object.values(messagesMap).map((messageData) => {
          return {
            id: messageData.id,
            content: messageData        .content,
        senderEmail: messageData.senderEmail,
        timestamp: messageData.timestamp,
      };
    })
    .sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());

    this.conversations.push({
      id: conversationDoc.id,
      displayName: otherUser.name,
      participants: participants,
      messages: messages,
    });
  }
},

async sendMessage() {
  if (!this.selectedUserEmail || !this.newMessage.trim()) {
    return;
  }
  const loggedInUserEmail = auth.currentUser.email;
  const conversationId = this.getConversationId(loggedInUserEmail, this.selectedUserEmail);
  const message = {
    content: this.newMessage,
    senderEmail: loggedInUserEmail,
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
      participants: [loggedInUserEmail, this.selectedUserEmail],
      messages: { [message.id]: message },
    });
  }

  this.newMessage = '';
  await this.fetchAndInitializeConversations();
},

getConversationId(email1, email2) {
  const emails = [email1, email2].sort();
  return `${emails[0]}_${emails[1]}`;
},

isSentByMe(message) {
  return message.senderEmail === auth.currentUser.email;
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
  display: inline-block;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sent-by-me {
  text-align: right;
}

.received {
  text-align: left;
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
