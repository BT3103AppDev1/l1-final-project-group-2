<template>
	<!-- The main login page -->
	<main class="login">
	  <!-- The section containing the login form -->
	  <section class="forms">
		<div class="form-wrapper">
        <img src="../photos/logo.png" alt="Image" class="image">
		 <!-- The button to go back to the home page -->
		 <button class="back-btn" @click="goBack">&#8592;</button>
		<!-- The login form -->
		<form class="form-page1" @submit.prevent="login">
		  <!-- The form title -->
		  <div class="form-container">
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
	
		</div>
		</form>
		</div>
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
	width: 100%;
    align-items: center;
    justify-content: center;
	
  }
  form.form-page1 {
	color: #FFF;
	background-color: #7784ee;
	background-image: grey;
	width: 60%;
  }

  .form-page1 {
	height: 100vh;
	justify-content: center;
	align-items: center;
	width: 100vh;
  }
  
  html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  
}

.form-wrapper {
/* The wrapper for the image and the form */	
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #ebf0f7;
  
}
  

  .image {
    /* The image takes up 50% of the width */
    height: auto;	
	width: 50%;  
  }

  
  
  
  h2 {
	/* The form title */
	font-size: 2rem;
	text-transform: uppercase;
	margin-bottom: 2rem;
  }
  
  title {
	font-size: 2rem;
	margin-top: 4rem; 
	margin-bottom: 2rem;
    text-align: center;
    
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
	padding: 0.5rem 0.5rem;
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

form.form-page1 input:not([type="submit"]) {
	color: #fff;
	border-bottom: 2px solid #FFF;
	
}
form.form-page1 input[type="submit"] {
	background-color:white;
	color: #7784ee;
	font-weight: 700;
	padding: 1rem 2rem;
	border-radius: 0.5rem;
	cursor: pointer;
	text-transform: uppercase;
	margin-top: 1rem;
}
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.back-btn {
  position: absolute; /* position the button absolutely */
  bottom: 0; /* align it to the bottom of the container */
  left: 0; /* align it to the left of the container */
  color: black;
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
body {
  overflow: hidden;
}



  

</style>
