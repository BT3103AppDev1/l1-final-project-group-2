<script>
import TaskCard from '../components/TaskCard.vue'
import firebaseApp from '../firebase/firebase';
import { onMounted } from 'vue';
import { getFirestore } from 'firebase/firestore'
import { collection, getDocs, setDoc, query, where, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore(firebaseApp);

export default {
  name: "Team",
  components: {
    TaskCard,
    },
  data(){
    return{
      team: '',
      teamMail: {},
      teamTask: {},
      task: {
        Name: '',
        Description: '',
        Due_Date: '',
        Assigner: '',
      },
      name: 'name',
      description: 'description',
      due_date: 'due_date',
      assignee_id: '',
    }
  },
  methods: {
    
    addTask(name) {
      // open task form & change assignee
      console.log("hi")
      console.log("name")
      document.getElementById("assignee").innerHTML = name;
      document.getElementById("myform").style.display = "block";
    },
    
    async addtofs() {
      const user = getAuth().currentUser
      let name = document.getElementById("task_name1").value 
      let due_date = document.getElementById("task_duedate1").value
      let description = document.getElementById("task_desc1").value
      let assignee = document.getElementById("assignee").innerHTML
      let assigner = getAuth().currentUser.email // set assignee as current user email
      this.assignee_id = ""
      try{
        
        // add inputs from task form to firestore database
        const docRef = await setDoc(doc(collection(db, "Tasks")), {
          Name: name, Due_Date: due_date, Description: description, Status: "ToDo", Assignee: assignee, Assigner: assigner 
        })

        
        let userData = await getDocs(query(collection(db, "users"), where("email", "==", assignee)))
        userData.forEach((doc) => {
          console.log(doc.data())
          this.assignee_id = doc.id
        })
        let assigneeRef = doc(db, "users", this.assignee_id)
        console.log(assigneeRef)
        await updateDoc(assigneeRef, {
            notification: true
          }).then(console.log("changed"))
        console.log("SAVED!")

        // reset form to blank
        document.getElementById("task_name1").value = "";
        document.getElementById("task_duedate1").value = "";
        document.getElementById("task_desc1").value = "";
        this.$emit("added")
        alert("Task added successfully")

        // automatically reload page after adding new task
        location.reload()

      }
      catch(error) {
        console.error("Error adding document: ", error);
        alert("Add Task was unsuccessful")
      }
    },

    closeForm() {
      // close task form
      console.log("bye")
      document.getElementById("myform").style.display = "none";

    },

    async getTasks() {
      const email = getAuth().currentUser.email
      console.log(email)
      // get all members who belong to same team as user
      let teamSnap = await getDocs(query(collection(db, "users"), where("email", "==", email)));
      this.team = ""
      teamSnap.forEach(doc => {
            this.team = doc.data().team
        });
        console.log(this.team)

      // get all tasks from all members of team
      let teamQuery = await getDocs(query(collection(db,"users"), where("team", "==", this.team)));
      this.teamTask = {}
      this.teamMail = {}

      // create task array for each team member
      teamQuery.forEach(doc => {
            var user_email = doc.data().email;
            var user_name = doc.data().name;
            console.log(user_email)
            this.teamMail[user_email] = user_name;
            this.teamTask[user_email] = [];
      });

      console.log(this.teamMail)
      console.log(Object.keys(this.teamMail))
      console.log(this.teamTask)

      const q = query(collection(db, "Tasks"), where("Assignee", "in", Object.keys(this.teamMail)), where("Status", "==", "ToDo"))
      const tasksRef = await getDocs(q)

      // push tasks into each member's array
      tasksRef.forEach(doc => {
            var task = doc.data();
            console.log(task)
            var assignee = task.Assignee;
            this.teamTask[assignee].push(task)
        });
        console.log(this.teamTask)
    }
  },

  created() {
    this.getTasks();
  }
}

</script>

<template>
  <main class='team'>
    <!-- page heading -->
    <div class='team-info'>
      <h1>Team Dashboard </h1> <span class="teamid" >{{ team }}</span>
    </div>
    <!-- each team member's todo task column --> 
    <div class='team-tasks'>
        <div class='team-column' v-for="(tasks, name) in teamTask" :key='name'>
            <!--  add task form -->
            <div class = "form-popup" >
              <div class = "popup" id = "myform">    
                <form action="/action_page.php" class = "formli">         
                  <h1> Create Task </h1>
                  <p id="assignee"> Member </p>
                  <label for="task_name1">Input Task Name</label>
                  <input type="text" placeholder="Task Name" id="task_name1" required>
                  <label for="task_duedate1">Input Due Date</label>
                  <input type="date" placeholder="Due Date" id="task_duedate1" required>
                  <label for="task_desc1">Input Task Description</label>
                  <textarea placeholder="Task Description" id="task_desc1" required></textarea>
                  <br>


                  <div class="Add">
                    <button class="btn" type="button" v-on:click="addtofs"> Add </button>
                  </div>

                  <div class="Close">
                    <button class="btn_close" type="button" v-on:click="closeForm"><span>&times;</span></button>
                  </div>
                </form>
              </div>
            </div>
            <!-- member's name and avatar icon -->
            <div id="nameHeading">
              <div class="circle">
                  <div class="circle-inner"><div v-if = 'teamMail'></div> {{teamMail[name][0]}} </div>
              </div>
              <div class='team-column-heading'>
                <!-- add task button --> 
                <h2 class='team-column-heading__title'>{{teamMail[name]}}</h2>
                <button class='task_add' v-on:click="addTask(name)"><span>&#43;</span></button>
              </div>
            </div>

            <!-- task card -->
            <div class="drop-zone">
            <TaskCard v-for="task in tasks" :key='task.id'
                  :Task='task.Name'
                  :Description='task.Description'
                  :DueDate='task.Due_Date'
                  :Assigner='teamMail[task.Assigner]'
            />
            </div>
      </div>

      
    </div>
  </main>
</template>

<style>

.team {
  margin-left: 100px
}

html {
  background-color:var(--bg);
}

 body {
	 color: #2e2e2f;
   width: 100%;
}

 h1 {
	 font-size: 30px;
   margin-bottom: 0.5px;
  }

 .team-info {
	 padding: 2rem 0;
	 display: flex;
	 width: 100%;
	 align-items: center;
}

.team-tasks {
	 display: grid;  
   	grid-template-columns: auto auto auto;
	  width: -webkit-fill-available; 
	  grid-column-gap: 1rem;
    overflow: auto;
}

.team-column {
  width: 450px
}
 .team-column-heading {

	 display: flex;
	 align-items: center;
	 justify-content: space-between;
   background-color: var(--white);
    padding: 0px 10px;
	 border-radius: 8px;
	 width: 385px;
	 box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
	 margin-bottom: 1rem;
	 border: 3px dashed transparent;

}
 .team-column-heading__title {
	font-size: 20px;
  padding: 10px;
  text-transform: none;
}

  .form-popup{
    position:relative;
    text-align: center;
    width: 100%;
  }

  .popup {
    display: none;
    position: fixed;
    left: 50%;
    top: 5%;
    transform: translate(-50%,10%);
    border: 3px solid #999999;
    z-index:9;
  }

  .formli {
    width: 400px;
    height: 580px;
    padding: 20px;
    background-color: #fff;
  }

  #assignee {
    color: white;
  }

  .formli input[type=text],  
  .formli input[type=date]{
    width: 100%;
    padding: 15px;
    margin: 5px 0 20px 0;
    border: 3px solid #999999;
    background: #fff;
    font-size: small;
  }

  #task_desc1 {
    height: 100px;
    display: flex;
    width: 360px;
    margin-bottom: 10px;
    border: 3px solid #999999;
    padding: 10px;
  }

  .formli .btn {
    padding: 10px 20px;
    background-color: white;
    color: black;
    border: 2px solid #999999;
    font-size:medium;
    cursor: pointer;
	  margin-bottom: 1rem;
    opacity: 0.8;
  }


  .task_add {
    background-color: #7784ee;
    padding: 2px 10px;
    margin-left: -50px
  }

  .task_delete {
    position: absolute;
    top: 0;
    right: 0;
    background-color: transparent;
    color: black;
    padding: 0;
    margin: 0;
    font-size: 30px;
  }

  #nameHeading{
    display: flex;
  }

  .circle {
    position: relative;
    top: 0;
    right: 0;
    display: flex;
    background-color: var(--light-grey);
    margin-bottom: 1rem;
    margin-right: 10px;
    border-radius: 50%;
  }

  
  .circle-inner {
  text-transform: capitalize;
    color: black;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    text-decoration: none;
    height: 40px;
    width: 47px;
    font-size: 20px;
    margin: 5px;
    padding: 7px;

}
.teamid {
  display: inline-flex;
  align-items: center;
  margin: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: whitesmoke;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #000000;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  width: fit-content;
  
}

</style>
