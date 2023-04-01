
  
  <template>
    <div class="landing">
      <h1>Welcome to my app</h1>
      <router-link to="/login">
        <button>Login</button>
      </router-link>
      <router-link to="/register">
        <button>Register</button>
      </router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Landing',
  }
  </script>
  
  <style>
  /* Add your landing page styles here */
  </style>