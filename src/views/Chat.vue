<template>
  <div class="main-container">
    <div class="content">
      <div class="user-list">
        <!-- Render the list of users -->
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
        <!-- Render the messages for the selected user -->
        <div class="user-info">
  <h1 class="selected-user-name" v-text="selectedUserDisplayName"></h1>
  <span class="teamid" v-text="selectedUserTeam"> </span>
</div>

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

        <!-- Form to send a new message -->
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

      // Find the conversation with the selected user
      const selectedConversation = this.conversations.find(conversation => {
        return conversation.participants && conversation.participants.includes(this.selectedUserEmail);
      });

      // Return the messages for the selected conversation
      return selectedConversation ? selectedConversation.messages : [];
    },

    selectedUserDisplayName() {
  // Find the selected user
  const selectedUser = this.users.find(user => user.email === this.selectedUserEmail);

  // Find the team of the selected user
  const selectedUserTeam = selectedUser ? selectedUser.team : "";

  // Return the name of the selected user and their team, or just their name if no user is selected
  return selectedUser ? `${selectedUser.name}` : "Chat";
},

selectedUserTeam() {
  const selectedUser = this.users.find(user => user.email === this.selectedUserEmail);
  return selectedUser && selectedUser.team ? selectedUser.team : "";
}


  },

  async created() {
    // Fetch the list of users and conversations when the component is created
    const loggedInUser = auth.currentUser;
    console.log("Logged-in user:", loggedInUser);

await this.fetchUsers();
await this.fetchAndInitializeConversations();
},

methods: {
async fetchUsers() {
  // Get the email of the logged-in user
  const loggedInUserEmail = auth.currentUser.email;

  // Fetch the list of users from the Firestore "users" collection
  const usersSnapshot = await getDocs(collection(db, "users"));

  // Add each user to the "users" array, except for the logged-in user
  usersSnapshot.forEach((userDoc) => {
    if (userDoc.data().email !== loggedInUserEmail) {
      this.users.push({
        email: userDoc.data().email,
        name: userDoc.data().name,
        team: userDoc.data().team
      });
    }
  });
},


async fetchAndInitializeConversations() {
  // Get the email of the logged-in user
  const loggedInUserEmail = auth.currentUser.email;

  // Construct a Firestore query to get the conversations that the user is a participant in
  const userConversationsSnapshot = query(
    collection(db, "conversations"),
    where("participants", "array-contains", loggedInUserEmail)
  );

  // Set up a real-time listener for updates in the conversations collection
  const unsubscribe = onSnapshot(userConversationsSnapshot, async (querySnapshot) => {
    // Reset the conversations array
    this.conversations = [];

    // Loop through each conversation in the query snapshot
    for (const conversationDoc of querySnapshot.docs) {
      // Get the participants and messages for the conversation
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

      // Add the conversation to the conversations array
      this.conversations.push({
        id: conversationDoc.id,
        displayName: otherUser.name,
        participants: participants,
        messages: messages,
      });
    }

    // Update the filtered messages and scroll to the bottom of the message container
    this.updateFilteredMessages();
    this.scrollToBottom();
  });

  // Cleanup the listener when the component is destroyed
  this.$once("hook:beforeDestroy", () => {
    unsubscribe();
  });
},

async sendMessage() {
  // Get the email of the logged-in user
  const loggedInUserEmail = auth.currentUser.email;

  // If no user is selected or the new message is empty, do nothing
  if (!this.selectedUserEmail || !this.newMessage.trim()) {
    return;
  }

  // Create a new message object
  const message = {
    content: this.newMessage,
    senderEmail: loggedInUserEmail,
    timestamp: new Date(),
    id: Date.now().toString(),
  };

  // Get the conversation ID for the conversation between the logged-in user and the selected user
  const conversationId = this.getConversationId(loggedInUserEmail, this.selectedUserEmail);

  // Get a reference to the Firestore document for the conversation
  const conversationRef = doc(db, "conversations", conversationId);
  const conversationSnapshot = await getDoc(conversationRef);

  // If the conversation already exists, add the message to the existing messages object
  if (conversationSnapshot        .exists()) {
        const currentMessages = conversationSnapshot.data().messages || {};
        await setDoc(conversationRef, {
          participants: conversationSnapshot.data().participants,
          messages: { ...currentMessages, [message.id]: message },
        });
      } else {
        // If the conversation doesn't exist yet, create a new conversation with the new message
        await setDoc(conversationRef, {
          participants: [loggedInUserEmail, this.selectedUserEmail],
          messages: { [message.id]: message },
        });
      }

      // Clear the new message input and scroll to the bottom of the message container
      this.newMessage = '';
      this.scrollToBottom();
    },

    scrollToBottom() {
      // Use the $nextTick method to wait for the DOM to update, then scroll to the bottom of the message container
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        container.scrollTop = container.scrollHeight;
      });
    },

    updateFilteredMessages() {
      // If no user is selected or the conversations array is empty, clear the filtered messages array
      if (!this.selectedUserEmail || this.conversations.length === 0) {
        this.filteredMessages = [];
        return;
      }

      // Find the conversation with the selected user
      const selectedConversation = this.conversations.find(conversation => {
        return conversation.participants && conversation.participants.includes(this.selectedUserEmail);
      });

      // Set the filtered messages array to the messages for the selected conversation
      this.filteredMessages = selectedConversation ? selectedConversation.messages : [];
    },
    
    formatTimestamp(timestamp) {
  // Format the timestamp as a string in the format "MM/DD/YYYY hh:mm"
  if (timestamp instanceof Date) {
    return timestamp.toLocaleString();
  }

  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleString([], {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'});
  }

  return "Invalid date";
},


    getConversationId(email1, email2) {
      // Sort the two emails alphabetically and concatenate them with an underscore to create the conversation ID
      const emails = [email1, email2].sort();
      return `${emails[0]}_${emails[1]}`;
    },

    isSentByMe(message) {
      // Return true if the message was sent by the logged-in user, false otherwise
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
  h1{
    margin-top: 1rem;
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
    padding-right: 1rem;
    background-color: #edf2f7;
  }

  .user-list > h1 {
    margin-top: 0;
    margin-bottom: 1rem;
    padding: 2rem 0;
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
    max-width: 1000px !important;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
background-color: #f8f8f8;
border-radius: 4px;
}

.chat-container h1 {

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
font-size: 0.6rem;
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
  background-color: #edf2f7;
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

.teamid {
  display: inline-flex;
  align-items: center;
  margin: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: whitesmoke;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #000000;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  width: fit-content;
  
}

.user-info {
  display: flex;
  align-items: center;
}

.selected-user-name {
  margin-right: 0.5rem;
}

</style>
