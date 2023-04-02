<template>
	<main class="login">
		<section class="images">
			//<img src="path/to/image.jpg" alt="Image description">
		</section>
	  <section class="forms">
		
		<form class="login" @submit.prevent="login">
		  <h1>Login</h1>
  
		  <input
			type="email"
			placeholder="Email address"
			v-model="login_form.email"
		  />
		  <input
			type="password"
			placeholder="Password"
			v-model="login_form.password"
		  />
		  <input type="submit" value="Login" />
		  <button @click="goBack">Back</button>
		</form>
	  </section>
	</main>
  </template>
  
  <script>
  import { ref } from "vue";
  import { useStore } from "vuex";
  import firebaseApp from "../firebase/firebase.js";
  import { getFirestore, addDoc, collection, setDoc,doc} from "firebase/firestore";
  import { useRouter } from 'vue-router';

  const db = getFirestore(firebaseApp);
  
  
  export default {
	setup() {
	const router = useRouter();
	  const login_form = ref({});
	  const store = useStore();
	  const login = () => {
		store.dispatch("login", login_form.value);
	  };

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
	flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
form {
	flex: 1 1 0%;
	padding: 8rem 1rem 1rem;
}
form.login {
	color: #FFF;
	background-color: rgb(245, 66, 101);
	background-image: linear-gradient(
		to bottom right,
		rgb(20, 22, 145) 0%,
		rgb(182, 17, 50) 100%
	);
}
h2 {
	font-size: 2rem;
	text-transform: uppercase;
	margin-bottom: 2rem;
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
	background-color: rgb(21, 39, 241);
	color: #FFF;
	font-weight: 700;
	padding: 1rem 2rem;
	border-radius: 0.5rem;
	cursor: pointer;
	text-transform: uppercase;
}


</style>
