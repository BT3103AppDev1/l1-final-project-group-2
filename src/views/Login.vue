<template>
	<!-- The main login page -->
	<main class="login">
	  <!-- The section containing the login form -->
	  <section class="forms">
		<!-- The login form -->
		<form class="login" @submit.prevent="login">
		  <!-- The form title -->
		  <h1 class="title">Login</h1>
	
		  <!-- The input field for email -->
		  <input
			type="email"
			placeholder="Email address"
			v-model="login_form.email"
		  />
	
		  <!-- The input field for password -->
		  <input
			type="password"
			placeholder="Password"
			v-model="login_form.password"
		  />
	
		  <!-- The submit button -->
		  <input type="submit" value="Login" />
	
		  <!-- The button to go back to the home page -->
		  <button class="back-btn" @click="goBack">&#8592;</button>
		</form>
	  </section>
	</main>
  </template>
  
  <script>
  import { ref } from "vue";
  import { useStore } from "vuex";
  import firebaseApp from "../firebase/firebase.js";
  import { getFirestore, addDoc, collection, setDoc, doc } from "firebase/firestore";
  import { useRouter } from 'vue-router';
  
  const db = getFirestore(firebaseApp);
  
  export default {
	setup() {
	  const router = useRouter();
	  
	  // The object containing the form data
	  const login_form = ref({});
	  
	  // The Vuex store
	  const store = useStore();
	  
	  // The login function to be called when the form is submitted
	  const login = () => {
		store.dispatch("login", login_form.value);
	  };
  
	  // The function to go back to the home page
	  const goBack = () => {
		router.push('/');
	  };
  
	  return {
		login_form,
		login,
		goBack
	  };
	},
  };
  </script>
  
  <style>
  .forms {
	/* The section containing the form is aligned vertically and horizontally */
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
  }
  
  form {
	/* The form takes up the entire width of the section */
	flex: 1 1 0%;
	padding: 20rem 1rem 1rem;
  }
  
  form.login {
	/* The login form has a black background with a gradient */
	color: #FFF;
	background-color: black;
	background-image: linear-gradient(
	  to bottom right,
	  rgb(117, 119, 210) 0%,
	  rgb(176, 85, 135) 100%
	);
  }
  
  h2 {
	/* The form title */
	font-size: 2rem;
	text-transform: uppercase;
	margin-bottom: 2rem;
  }
  
  .title {
	/* The login form title */
	font-size: 2rem;
	text-transform: uppercase;
	margin-bottom: 2rem;
	text-align: center;
  }
  
  .back-btn {
	/* The button to go back to the home page */
	color: white;
	font-size: 60px;
	border: none;
	background-color: transparent;
	cursor: pointer;
	transition: color 0.3s ease;
  }
  
  .back-btn:hover {
	color: #cccccc;
  }
  
  .back-btn.clicked {
	color: black;
  }
  

input {
	appearance: none;
	border: none;
	outline: none;
	background: none;
	display: block;
	width: 100%;
	max-width: 400px;
	margin: 0 auto;
	font-size: 1.5rem;
	margin-bottom: 2rem;
	padding: 0.5rem 0rem;
}
input:not([type="submit"]) {
	opacity: 0.8;
	transition: 0.4s;
}
input:focus:not([type="submit"]) {
	opacity: 1;
}
input::placeholder {
	color: inherit;
}

form.login input:not([type="submit"]) {
	color: #fff;
	border-bottom: 2px solid #2c3e50;
}
form.login input[type="submit"] {
	background-color:#7784ee;
	color: #FFF;
	font-weight: 700;
	padding: 1rem 2rem;
	border-radius: 0.5rem;
	cursor: pointer;
	text-transform: uppercase;
}


</style>
