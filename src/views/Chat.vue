<template>
  <div class="chat">
    <h1>Chat</h1>
    <div class="chat__messages">
      <div v-for="message in messages" :key="message.id" class="chat__message">
        <p class="chat__message-text">{{ message.text }}</p>
        <span class="chat__message-time">{{ message.time }}</span>
      </div>
    </div>
    <form class="chat__form" @submit.prevent="sendMessage">
      <input class="chat__input" type="text" v-model="newMessage" placeholder="Type your message here">
      <button class="chat__button" type="submit">Send</button>
    </form>
  </div>
</template>

<script>
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

export default {
  data() {
    return {
      messages: [],
      newMessage: '',
    }
  },
  async mounted() {
    const messagesRef = collection(db, 'Messages')
    const q = query(messagesRef, orderBy('time', 'asc'))

    onSnapshot(q, (querySnapshot) => {
      const messages = []
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() })
      })
      this.messages = messages
    })
  },
  methods: {
    async sendMessage() {
      if (!this.newMessage) return

      try {
        const { uid, photoURL, displayName } = auth.currentUser
        const time = serverTimestamp()
        const messageData = {
          text: this.newMessage,
          time,
          uid,
          photoURL,
          displayName,
        }
        await addDoc(collection(db, 'Messages'), messageData)
        this.newMessage = ''
      } catch (error) {
        console.error('Error writing new message to Firebase Database', error)
      }
    },
  },
}
</script>
