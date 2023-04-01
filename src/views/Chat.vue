<template>
  <div>
    <div v-if="selectedRecipientMessages.length > 0">
      <div v-for="(message, index) in selectedRecipientMessages" :key="index">
        <div>
          {{ message.senderId }}: {{ message.content }}
          ({{ new Date(message.timestamp.seconds * 1000).toLocaleString() }})
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
      selectedConversation: null,
      selectedRecipientMessages: [],
    };
  },
  computed: {
  selectedConversation() {
    return this.conversations.find(conversation => {
      return conversation.participants.includes(this.selectedUser);
    });
  },
},


  async created() {
    const loggedInUser = auth.currentUser;

    console.log("Logged-in user:", loggedInUser);

    await this.fetchAndInitializeConversations();
    await this.fetchUsers();
  },
  watch: {
  selectedUser(newValue) {
    this.selectedConversation = this.conversations.find(conversation => {
      return conversation.participants.includes(newValue);
    });
  },
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

        const messages = await this.fetchMessages(conversationDoc.id);

        this.conversations.push({
          id: conversationDoc.id,
          displayName: otherUserDoc.data().name,
          messages: messages,
        });
      }
    },

    async fetchMessages(conversationId) {
      const messagesSnapshot = await getDocs(
        query(collection(doc(db, "conversations", conversationId), "messages"), orderBy("timestamp", "asc"))
      );
      const messages = messagesSnapshot.docs.map((doc) => doc.data());

      return messages;
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
      };

      const conversationRef = doc(db, "conversations", conversationId);
      const conversationSnapshot = await getDoc(conversationRef);

      if (conversationSnapshot.exists()) {
        await setDoc(conversationRef, {
          participants: conversationSnapshot.data().participants,
          messages: [...conversationSnapshot.data().messages, message],
        });
      } else {
        await setDoc(conversationRef, {
          participants: [loggedInUserId, this.selectedUserId],
          messages: [message],
        });
      }

      this.newMessage = '';
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

