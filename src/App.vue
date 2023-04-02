

<template>

  <div id="sidenav" v-if="$store.state.user">
    <a><router-link to="/">Home</router-link></a>
    <a><router-link to="/team">Team</router-link></a>
    <a><router-link to="/leave">Leave</router-link></a>
    <a><router-link to="/chat">Chat</router-link></a>
    <a><button @click="$store.dispatch('logout')">Logout</button></a>
  </div>
  <router-view/>
</template>

<script>
import { onBeforeMount } from 'vue'
import { useStore } from 'vuex'
export default {
  setup() {
    const store = useStore()
    onBeforeMount(() => {
      store.dispatch('fetchUser')
    })
  }
  
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color:var(--bg);

}
#sidenav {
  height: 100%; /* Full-height: remove this if you want "auto" height */
  width: 100px; /* Set the width of the sidebar */
  position: fixed; /* Fixed Sidebar (stay in place on scroll) */
  z-index: 1; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 0;
  background-color: white;
  overflow-x: hidden; /* Disable horizontal scroll */;
  padding: 200px 0px;
}

#sidenav a {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: 25px;
  color: #2e2e2f;
}

</style>