<template>
    
	<main class="login">
	  <section class="forms">
		<form class="register" @submit.prevent="register">
            <h1 class = "title">Register</h1>
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
          <div class="select-container">
            <label for="teamDropdown">Team</label>
		  <select v-model="register_form.team" id = "teamDropdown">
			<option value="" disabled selected>Select team</option>
			<option value="team1">Business</option>
			<option value="team2">Communications</option>
			<option value="team3">Technology</option>
			<option value="team4">Marketing</option>
		  </select>
          <label for="roleDropdown">Role</label>
		  <select v-model="register_form.role" id = "roleDropdown">
			<option value="" disabled>Select Role</option>
			<option value="role1">Employee</option>
			<option value="role2">Employer</option>
		  </select>
        </div>
			
		  
		  <input type="submit" value="Register" />
          <button class = "back" @click="goBack">Back</button>
		</form>
        
		
	  </section>
	</main>
  </template>
  
  <script>
  import { ref } from "vue";
  import { useStore } from "vuex";
  import {db,auth} from "../firebase/firebase.js";
  import { addDoc, collection,setDoc , doc} from "firebase/firestore";
  import { useRouter } from 'vue-router';
  
  
  

  
  export default {
      
	setup() {
	  
	  const register_form = ref({});
	  const store = useStore();
      const router = useRouter();
      const uid = ref(null);

      
	  
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
    const docRefTwo = await addDoc(colRef, dataObj);
		  console.log("Document was created with ID:", docRef.id);
		  console.log("Document was created with ID:", docRefTwo.id);
          const uidDocRef = doc(db, "users", docRef.id);
          await setDoc(uidDocRef, { uid: docRef.id });
		} catch (error) {
		  console.error("Error adding document: ", error);
		}
	  };
     
    
    
    const goBack = () => {
      router.push('/');
    };

    const user = auth.currentUser;
    if (user) {
      uid.value = user.uid;
    }

  
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
		rgb(20, 22, 145) 0%,
		rgb(182, 17, 50) 100%
	);
}
.title {
	font-size: 2rem;
	text-transform: uppercase;
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
	padding: 0.5rem 0rem;
}
select { 
    width: 100%;
	max-width: 400px;
    background-color: #d72f7e;
  color: white;
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
display:block;
-webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
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

form.register input[type="submit"] {
	background-color:rgb(28, 79, 207);
	color: #FFF;
	font-weight: 700;
	padding: 1rem 2rem;
	border-radius: 0.5rem;
	cursor: pointer;
	text-transform: uppercase;
}
.back {
    text-align: center;
    background-color: #FFF;
	color: rgb(28, 79, 207);
	font-weight: 700;
	padding: 1rem 2rem;
	border-radius: 0.5rem;
	cursor: pointer;
	text-transform: uppercase;
}
.select-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.select-container select {
  margin-bottom: 1rem;
}






</style>
