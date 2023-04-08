<template>
  <div class="main-container">
    <div class="content">
      <div class="user-list">
  <h1>Messages</h1>
  <div
    v-for="user in users"
    :key="user.email"
    @click="selectedUserEmail = user.email"
    :class="{ 'selected-user': user.email === selectedUserEmail }"
  >
    <div class="user-icon">
      {{ user.name.charAt(0).toUpperCase() }}
    </div>
    {{ user.name }}
  </div>
</div>

<div class="chat-container">
  <h1 v-text="selectedUserDisplayName"></h1>

        <div class="messages-container" ref="messagesContainer">
          <div v-if="filteredMessages.length > 0">
            <div
              v-for="(message, index) in filteredMessages"
              :key="index"
              :class="{ 'sent-by-me': isSentByMe(message) }"
            >
              <div class="message">
                {{ message.content }}
                <span class="timestamp">
                  ({{ formatTimestamp(message.timestamp) }})
                </span>
              </div>
            </div>
          </div>
        </div>
        <form @submit.prevent="sendMessage">
          <input type="text" v-model="newMessage" placeholder="Type your message here..." />
          <button type="submit" :disabled="!selectedUserEmail">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24" height="24">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </svg>
</button>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, doc, getDocs, getDoc, setDoc, query, orderBy, where, onSnapshot } from "firebase/firestore";
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

    selectedUserDisplayName() {
    const selectedUser = this.users.find(user => user.email === this.selectedUserEmail);
    return selectedUser ? selectedUser.name : "Chat";
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
  const userConversationsSnapshot = query(
    collection(db, "conversations"),
    where("participants", "array-contains", loggedInUserEmail)
  );

  // Set up a real-time listener for updates in the conversations collection
  const unsubscribe = onSnapshot(userConversationsSnapshot, async (querySnapshot) => {
    this.conversations = [];

    for (const conversationDoc of querySnapshot.docs) {
      const participants = conversationDoc.data().participants;
      const otherUserEmail = participants.find((email) => email !== loggedInUserEmail);

      const otherUser = this.users.find((user) => user.email === otherUserEmail);
      const messagesMap = conversationDoc.data().messages;
      const messages = Object.values(messagesMap)
        .map((messageData) => {
          return {
            id: messageData.id,
            content: messageData.content,
            senderEmail: messageData.senderEmail,
            timestamp: messageData.timestamp,
          };
        })
        .sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);

      this.conversations.push({
        id: conversationDoc.id,
        displayName: otherUser.name,
        participants: participants,
        messages: messages,
      });
    }

    this.updateFilteredMessages();
    this.scrollToBottom();
  });

  // Cleanup the listener when the component is destroyed
  this.$once("hook:beforeDestroy", () => {
    unsubscribe();
  });
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
  this.scrollToBottom();
},

scrollToBottom() {
  this.$nextTick(() => {
    const container = this.$refs.messagesContainer;
    container.scrollTop = container.scrollHeight;
  });
},


updateFilteredMessages() {
      if (!this.selectedUserEmail || this.conversations.length === 0) {
        this.filteredMessages = [];
        return;
      }

      const selectedConversation = this.conversations.find(conversation => {
        return conversation.participants && conversation.participants.includes(this.selectedUserEmail);
      });

      this.filteredMessages = selectedConversation ? selectedConversation.messages : [];
    },

    formatTimestamp(timestamp) {
  if (timestamp instanceof Date) {
    return timestamp.toLocaleString();
  }

  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  }

  return "Invalid date";
},


getConversationId(email1, email2) {
  const emails = [email1, email2].sort();
  return `${emails[0]}_${emails[1]}`;
},

isSentByMe(message) {
  return message.senderEmail === auth.currentUser.email;
},
},
};
</script>

<style scoped>
  * {
    box-sizing: border-box;
  }

  body {
    font-family: Arial, sans-serif;
  }

  .main-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    margin-left: 100px
  }

  header {
    background-color: #2d3748;
    padding: 1rem;
  }

  header h1 {
    color: #fff;
    margin: 0;
  }

  .content {
    display: flex;
    flex-grow: 1;
  }

  .user-list {
    width: 250px;
    max-height: calc(100vh - 64px);
    overflow-y: auto;
    border-right: 1px solid #ccc;
    padding: 1rem;
    background-color: #edf2f7;
  }

  .user-list > h1 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .user-list > div {
    padding: 10px;
    margin-bottom: 10px;
    background-color: #f8f8f8;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }

  .user-list > div:hover {
    background-color: #eee;
  }

  .selected-user {
    background-color: #4a5568;
    color: rgb(77, 71, 237);
  }

  .chat-container {
    flex-grow: 1;
    max-width: 800px;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
background-color: #f8f8f8;
border-radius: 4px;
}

.chat-container h1 {
font-size: 1.5rem;
margin-bottom: 1rem;
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

.timestamp {
font-size: 0.8rem;
color: #777;
margin-left: 1rem;
}

form {
display: flex;
margin-top: 1rem;
border-top: 1px solid #ccc;
padding-top: 1rem;
}

input[type="text"] {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: Arial, sans-serif;
  font-size: 16px;
  height: 36px;
  width: 100%;
  box-sizing: border-box;
}


button[type="submit"] {
  margin-left: 0.5rem;
  padding: 0 0.5rem;
  height: 36px;
  width: 36px;
  background-color: #4a5568;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1;
}

button[type="submit"]:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}


input[type="text"]::placeholder {
color: #999;
}

.user-icon {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: #4a5568;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  margin-right: 10px;
}

.messages-container {
  overflow-y: auto;
  max-height: calc(100vh - 240px);
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f8f8f8;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chat-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-width: 800px;
  padding: 1rem;
}

form {
  margin-top: auto;
  border-top: 1px solid #ccc;
  padding-top: 1rem;
}


</style>
