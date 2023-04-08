
<template>
  <div v-if="$store.state.user">
    <div id="sidenav">
      <img src="../src/photos/logo.png" alt="Logo" class="logo-img">
      <a><router-link to="/"><i class="fas fa-home"></i></router-link></a>
      <a><router-link to="/team"><i class="fas fa-users"></i></router-link></a>
      <a><router-link to="/leave"><i class="fas fa-calendar-times"></i></router-link></a>
      <a><router-link to="/chat"><i class="fas fa-comments"></i></router-link></a>
      <a><button @click="$store.dispatch('logout')"><i class="fas fa-sign-out-alt"></i></button></a>
    </div>
  </div>
  <router-view />
</template>


<script>
import { onBeforeMount, computed } from 'vue'
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

<style >
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color:#EBF0F7;
  width:100%;
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
  margin-bottom: 20px;
}
#sidenav a:hover {
  background-color: #7784ee;
}
.logo-img {
  display: flex;
  position: fixed;
  top: 10px;

  width: 100px;
  height: 100px;
  z-index: 2;
  justify-content: center;
  align-items: center;
}
button{
  padding:15px, 30px;
}

</style>
