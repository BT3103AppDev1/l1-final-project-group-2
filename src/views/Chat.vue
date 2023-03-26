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
        <option v-for="user in users" :key="user.id" :value="user.id">{{ user.displayName }}</option>
      </select>
    </div>
    <form @submit.prevent="sendMessage">
      <input type="text" v-model="newMessage" />
      <button type="submit" :disabled="!selectedUser">Send</button>
    </form>
  </div>
</template>


<script>
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection, doc, getDocs, getDoc, setDoc, query, orderBy } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJ56Dc6lkHOcHa1bgjb0cQvFAsgF_cgas",
  authDomain: "workwise-5e049.firebaseapp.com",
  projectId: "workwise-5e049",
  storageBucket: "workwise-5e049.appspot.com",
  messagingSenderId: "21430156356",
  appId: "1:21430156356:web:800e3e02a87e6efb7c1011",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp); // add this line to initialize Firestore

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
  const loggedInUserId = "logged_in_user_id"; // Replace with the actual logged-in user ID
  const usersSnapshot = await getDocs(collection(db, "users"));

  usersSnapshot.forEach((userDoc) => {
    if (userDoc.id !== loggedInUserId) {
      this.users.push({
        id: userDoc.id,
        displayName: userDoc.data().displayName,
      });
    }
  });
},

    async fetchAndInitializeConversations() {
      const loggedInUserId = auth.currentUser;
      const usersSnapshot = await getDocs(collection(db, "users"));

      for (const userDoc of usersSnapshot.docs) {
        if (userDoc.id !== loggedInUserId) {
          const conversationId = this.getConversationId(loggedInUserId, userDoc.id);
          const conversationRef = doc(db, "conversations", conversationId);

          const conversationSnapshot = await getDoc(conversationRef);
          if (!conversationSnapshot.exists()) {
            await setDoc(conversationRef, {
              participants: [loggedInUserId, userDoc.id],
              messages: [],
            });
          }

          this.conversations.push({
            id: conversationId,
            displayName: userDoc.data().displayName,
            messages: await this.fetchMessages(conversationId),
          });
        }
      }
    },
    async fetchMessages(conversationId) {
      const messagesSnapshot = await getDocs(
        query(collection(doc(db, "conversations", conversationId), "messages"), orderBy("timestamp", "asc"))
      );
      return messagesSnapshot.docs.map((doc) => doc.data());
    },
    async sendMessage() {
  if (!this.selectedUser) {
    return;
  }

  // The rest of the sendMessage implementation
},

    getConversationId(user1, user2) {
      const ids = [user1, user2].sort();
      return `${ids[0]}_${ids[1]}`;
    },
  },
};
</script>