Here are the comments for the code:

<template>
    
	<main class="login">
	  <section class="forms">
      <div class="form-wrapper">
        <img src="../photos/logo.png" alt="Image" class="image">
       <!-- The button to go back to the home page -->
		 <button class="back-btn" @click="goBack">&#8592;</button>
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
			<option value="Business">Business</option>
			<option value="Communications">Communications</option>
			<option value="Technology">Technology</option>
			<option value="Marketing">Marketing</option>
		  </select>
          <label for="roleDropdown">Role</label>
		  <select v-model="register_form.role" id = "roleDropdown">
			<option value="" disabled>Select Role</option>
			<option value="Employee">Employee</option>
			<option value="Employer">Employer</option>
		  </select>
        </div>
			
		  
		  <input type="submit" value="Register" />
         
		</form>
  </div>  
		
	  </section>
	</main>
</template>
  
<script>
import { ref } from "vue";
import { useStore } from "vuex";
import {db,auth} from "../firebase/firebase.js";
import { addDoc, collection,setDoc , doc,updateDoc} from "firebase/firestore";
import { useRouter } from 'vue-router';
import { onAuthStateChanged } from "firebase/auth";

// Exporting the component
export default {
  setup() {
    // Initializing the reactive variables
    const register_form = ref({});
    const store = useStore();
    const router = useRouter();
    const uid = ref(null);

    // Function to create a new user
    const createUser = async (uid) => {
      const colRef = collection(db, "users");

      const colRefTwo = collection(db, "teams",register_form.value.team,"users");
      const dataObj = {
        name: register_form.value.name,
        email: register_form.value.email,
        team: register_form.value.team,
        role: register_form.value.role,
        notification: false,
      };
      try {
        const docRef = await setDoc(doc(colRef, uid), dataObj);
        const docRefTwo = await setDoc(doc(colRefTwo, uid), dataObj);
        console.log("Document was created with ID:", docRef.id);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    };

    // Function to register a new user
    const register = async () => {
      store.dispatch("register", register_form.value);
    };

    // Function to go back to the home page
    const goBack = () => {
      router.push('/');
    };

    // Function to check if a user is authenticated
    onAuthStateChanged(auth, (user) => {
      if (user) {
        uid.value = user.uid;
        createUser(uid.value);
      }
    });

    // Returning the reactive variables and functions
    return {
      register_form,
      register,
      goBack
    };
  }
}
</script>

<style scoped>
.forms {
	/* The section containing the form is aligned vertically and horizontally */
	flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
form.register {
	color: #FFF;
	background-color: black;
	background-image: grey
	
}

.register{
 
  height: 40rem;
}

.form-wrapper {
    /* The wrapper for the image and the form */
    display: flex;
    align-items: center;
  }
  .image {
    /* The image takes up 50% of the width */
   
    height: auto;
	
	width: 50%;
  
    
  }
  .image img {
    
    max-width: 500px;
  }

  h2 {
	/* The form title */
	font-size: 2rem;
	text-transform: uppercase;
	margin-bottom: 2rem;
  }
.title {
	font-size: 2rem;
	
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
  background-color: white;
  outline: black;
  color: black;
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  display: block;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%23000' /%3E%3C/svg%3E");
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
	background-color: #7784ee;
	color: #fff;
	font-weight: 700;
	padding: 1rem 2rem;
	border-radius: 0.5rem;
	cursor: pointer;
	text-transform: uppercase;
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


  .register {
    width: 50%;
    display: inline-block;
    vertical-align: top;
    padding: 10pt;
  }
  body {
  overflow: hidden;
}



</style>
