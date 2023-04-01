<template>
	<main class="login">
	  <section class="forms">
		<form class="register" @submit.prevent="register">
		  <h2>Register</h2>
		  <input
			type="name"
			placeholder="Name"
			v-model="register_form.name"
		  />
		  <input
			type="email"
			placeholder="Email address"
			v-model="register_form.email"
		  />
		  <input
			type="password"
			placeholder="Password"
			v-model="register_form.password"
		  />
		  <input
			type="team"
			placeholder="Team"
			v-model="register_form.team"
		  />
		  <input
			type="role"
			placeholder="Role"
			v-model="register_form.role"
		  />
		  <input type="submit" value="Register" />
          <button @click="goBack">Back</button>
		</form>
        
		
	  </section>
	</main>
  </template>
  
  <script>
  import { ref } from "vue";
  import { useStore } from "vuex";
  import firebaseApp from "../firebase/firebase.js";
  import { getFirestore, addDoc, collection } from "firebase/firestore";
  import { useRouter } from 'vue-router';
  
  const db = getFirestore(firebaseApp);
  
  export default {
	setup() {
	  
	  const register_form = ref({});
	  const store = useStore();
      const router = useRouter();
	  
	  const register = async () => {
		store.dispatch("register", register_form.value);
		await createUser();
	  };
	  const createUser = async () => {
		const colRef = collection(db, "users");
		const colRefTwo = collection(db, "teams",register_form.value.team,"users");
		const dataObj = {
		  name: register_form.value.name,
		  email: register_form.value.email,
		  team: register_form.value.team,
		  role: register_form.value.role,
		};
		try {
		  const docRef = await addDoc(colRef, dataObj);
		  const docRefTwo = await addDoc(colRefTwo, dataObj);
		  console.log("Document was created with ID:", docRef.id);
		  console.log("Document was created with ID:", docRefTwo.id);
		} catch (error) {
		  console.error("Error adding document: ", error);
		}
	  };
     
    
    
    const goBack = () => {
      router.push('/');
    };
  
	  return {
		
		register_form,
		register,
		createUser,
        goBack
	  };
	}
  }
  </script>
  

<style>
.forms {
	display: flex;
	min-height: 100vh;
}
form {
	flex: 1 1 0%;
	padding: 8rem 1rem 1rem;
}
form.register {
	color: #FFF;
	background-color: rgb(245, 66, 101);
	background-image: linear-gradient(
		to bottom right,
		rgb(245, 66, 101) 0%,
		rgb(189, 28, 60) 100%
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
form.register input:not([type="submit"]) {
	color: #FFF;
	border-bottom: 2px solid #FFF;
}
form.login input:not([type="submit"]) {
	color: #2c3e50;
	border-bottom: 2px solid #2c3e50;
}
form.login input[type="submit"] {
	background-color: rgb(245, 66, 101);
	color: #FFF;
	font-weight: 700;
	padding: 1rem 2rem;
	border-radius: 0.5rem;
	cursor: pointer;
	text-transform: uppercase;
}
form.register input[type="submit"] {
	background-color: #FFF;
	color: rgb(245, 66, 101);
	font-weight: 700;
	padding: 1rem 2rem;
	border-radius: 0.5rem;
	cursor: pointer;
	text-transform: uppercase;
}

</style>
