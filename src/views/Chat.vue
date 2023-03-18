<template>
  <div class="chat-container">
    <div class="chat-list">
      <div
        v-for="conversation in conversations"
        :key="conversation.id"
        class="conversation-item"
        :class="{ 'active': conversation.id === activeConversation }"
        @click="selectConversation(conversation.id)"
      >
        <img :src="conversation.photoURL" alt="user" class="avatar" />
        <div class="info">
          <div class="name">{{ conversation.displayName }}</div>
          <div class="message">{{ conversation.lastMessage }}</div>
        </div>
        <div class="time">{{ conversation.time }}</div>
      </div>
    </div>
    <div class="chat">
      <div v-if="activeConversation">
        <div class="chat-header">
          <div class="name">{{ activeConversationName }}</div>
          <button class="close-button" @click="closeConversation">&times;</button>
        </div>
        <div class="chat-messages">
          <div v-for="message in activeConversationMessages" :key="message.id" class="message">
            <div class="bubble" :class="{ 'mine': message.uid === currentUser.uid }">{{ message.text }}</div>
            <div class="time">{{ message.time }}</div>
          </div>
        </div>
        <form class="chat-form" @submit.prevent="sendMessage">
          <input type="text" v-model="newMessage" placeholder="Type your message here" />
          <button type="submit">Send</button>
        </form>
      </div>
      <div v-else>
        <p>Select a conversation to start chatting.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirestore, doc, setDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import { where } from 'firebase/firestore';

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
const db = getFirestore(firebaseApp)
const auth = getAuth()

export default {
  data() {
    return {
      conversations: [],
      activeConversation: null,
      newMessage: '',
      currentUser: auth.currentUser,
    }
  },
  computed: {
    activeConversationName() {
      const conversation = this.conversations.find(c => c.id === this.activeConversation)
      return conversation ? conversation.displayName : ''
    },
    activeConversationMessages() {
      const conversation = this.conversations.find(c => c.id === this.activeConversation)
      return conversation ? conversation.messages : []
    },
  },
  methods: {
    
    async sendMessage() {
      if (!this.newMessage.trim()) return

      try {
        const { uid, photoURL, displayName } = this.currentUser
        const createdAt = new Date().toISOString()
        const messageData = {
          text: this.newMessage,
          createdAt,
          uid,
          photoURL,
          displayName,
        }
        await setDoc(doc(collection(db, 'conversations', this.activeConversation, 'messages'), new Date().getTime().toString()), messageData)
        this.newMessage = ''
      } catch (error) {
        console.error('Error writing new message to Firebase Database', error)
      }
    },
    async selectConversation(conversationId) {
      this.activeConversation = conversationId

      const conversationRef = collection(db, 'conversations', conversationId, 'messages')
      const q = query(conversationRef, orderBy('createdAt'))

      onSnapshot(q, querySnapshot => {
        const messages = []
        querySnapshot.forEach(doc => {
          messages.push({ id: doc.id, ...doc.data() })
        })
        const conversationIndex = this.conversations.findIndex(c => c.id === conversationId)
        if (conversationIndex !== -1) {
          this.conversations[conversationIndex].messages = messages
          this.conversations[conversationIndex].lastMessage = messages[messages.length - 1].text
          this.conversations[conversationIndex].time = messages[messages.length - 1].createdAt
        }
      })
    },
    closeConversation() {
      this.activeConversation = null
    },
  },
  mounted() {
  const conversationsRef = collection(db, 'conversations')
  const q = query(conversationsRef, where('members', 'array-contains', this.currentUser.uid), orderBy('updatedAt', 'desc'))

  onSnapshot(q, querySnapshot => {
    console.log(querySnapshot)
    const conversations = []
    querySnapshot.forEach(doc => {
      const data = doc.data()
      const members = data.members.filter(m => m !== this.currentUser.uid)
      const conversation = {
        id: doc.id,
        members,
        displayName: data.displayName || members[0],
        photoURL: data.photoURL || '',
        lastMessage: '',
        time: '',
        messages: [],
      }
      conversations.push(conversation)
    })
    console.log(conversations)
    this.conversations = conversations
  })
},
}
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100%;
}

.chat-list {
  flex: 1 1 300px;
  border-right: 1px solid #eee;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.conversation-item:hover {
  background-color: #f7f7f7;
}

.active {
  background-color: #f7f7f7;
}

.avatar {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 10px;
}

.info {
  flex: 1 1 auto;
}

.name {
  font-weight: 600;
}

.time {
  margin-left: auto;
}

.chat {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.name {
  font-weight: 600;
  margin-right: auto;
}

.close-button {
  border: none;
  background-color: transparent;
  color: #999;
  cursor: pointer;
  font-size: 24px;
  margin-left: 10px;
}

.close-button:hover {
  color: #666;
}

.chat-messages {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 10px;
}

.message {
  display: flex;
  margin-bottom: 10px;
}

.bubble {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 10px;
  max-width: 80%;
}

.bubble.mine {
  background-color: #007bff;
  color: #fff;
  margin-left: auto;
}

.time {
  font-size: 12px;
  margin-left: 10px;
  align-self: flex-end;
}

.chat-form {
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #eee;
}

input[type="text"] {
  flex: 1 1 auto;
  padding: 10px;
  border: none;
  border-radius: 20px;
  margin-right: 10px;
}

input[type="text"]:focus {
  outline: none;
  box-shadow: none;
}

button[type="submit"] {
  border: none;
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
}

button[type="submit"]:hover {
  background-color: #0069d9;
}

@media screen and (max-width: 768px) {
  .chat-container {
    flex-direction: column;
  }

  .chat-list {
    flex: 1 1 auto;
    border-right: none;
    border-bottom: 1px solid #eee;
    overflow-y: hidden;
  }

  .chat-messages {
    padding-top: 0;
    padding-bottom: 10px;
  }
}
</style>