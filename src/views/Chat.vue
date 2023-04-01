<template>
  <div>
    <div v-for="conversation in conversations" :key="conversation.id">
      <h3>{{ conversation.displayName }}</h3>
      <div v-for="message in conversation.messages" :key="message.id">
        <div>{{ message.senderId }}: {{ message.content }}</div>
      </div>
    </div>
    <div>
      <label for="userSelect">Select user to send a message:</label>
      <select id="userSelect" v-model="selectedUser">
        <option disabled value="">Please select a user</option>
        <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
      </select>
    </div>
    <form @submit.prevent="sendMessage">
      <input type="text" v-model="newMessage" />
      <button type="submit" :disabled="!selectedUser">Send</button>
    </form>
  </div>
</template>


<script>
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, query, orderBy, where } from "firebase/firestore";
import { auth, db } from '../firebase/firebase';

export default {
  data() {
    return {
      newMessage: "",
      conversations: [],
      selectedUser: "",
      users: [],
    };
  },
  async created() {
    await this.fetchAndInitializeConversations();
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      const loggedInUserId = auth.currentUser.uid;
      const usersSnapshot = await getDocs(collection(db, "users"));

      console.log("Fetched users:", usersSnapshot.docs); // Add this line to debug

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
    
    console.log("otherUserId:", otherUserId); // Add this line to debug
    
    const otherUserDoc = await getDoc(doc(db, "users", otherUserId));

    console.log("otherUserDoc:", otherUserDoc); // Add this line to debug
    console.log("otherUserDoc.data():", otherUserDoc.data()); // Add this line to debug

    this.conversations.push({
      id: conversationDoc.id,
      name: otherUserDoc.data().name,
      messages: await this.fetchMessages(conversationDoc.id),
    });
  }
},

    async fetchMessages(conversationId) {
      const messagesSnapshot = await getDocs(
        query(collection(doc(db, "conversations", conversationId), "messages"), orderBy("timestamp", "asc"))
      );
      return messagesSnapshot.docs.map((doc) => doc.data());
    },
    async sendMessage() {
      if (!this.selectedUser || !this.newMessage.trim()) {
        return;
      }

      const loggedInUserId = auth.currentUser.uid;
      const conversationId = this.getConversationId(loggedInUserId, this.selectedUser);
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
          participants: [loggedInUserId, this.selectedUser],
          messages: [message],
        });
      }

      this.newMessage = '';
    },

    getConversationId(user1, user2) {
      const ids = [user1, user2].sort();
      return `${ids[0]}_${ids[1]}`;
    },
  },
};
</script>
