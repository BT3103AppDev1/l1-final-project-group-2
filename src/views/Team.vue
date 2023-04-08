<script>
import TaskCard from '../components/TaskCard.vue'
import firebaseApp from '../firebase/firebase';
import { onMounted } from 'vue';
import { getFirestore } from 'firebase/firestore'
import { collection, getDocs, setDoc, query, where, doc } from "firebase/firestore";
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
    }
  },
  methods: {
    addTask(name) {
      console.log("hi")
      console.log("name")
      document.getElementById("assignee").innerHTML = name;
      document.getElementById("myform").style.display = "block";
    },
    
    async addtofs() {
      let name = document.getElementById("task_name1").value 
      let due_date = document.getElementById("task_duedate1").value
      let description = document.getElementById("task_desc1").value
      let assignee = document.getElementById("assignee").innerHTML
      let assigner = getAuth().currentUser.email

      try{

        const docRef = await setDoc(doc(collection(db, "Tasks")), {
          Name: name, Due_Date: due_date, Description: description, Status: "ToDo", Assignee: assignee, Assigner: assigner 
        })
        console.log("SAVED!")
        document.getElementById("task_name1").value = "";
        document.getElementById("task_duedate1").value = "";
        document.getElementById("task_desc1").value = "";
        this.$emit("added")
        alert("Task added successfully")
        location.reload()

      }
      catch(error) {
        console.error("Error adding document: ", error);
        alert("Add Task was unsuccessful")
      }
    },

    closeForm() {
      console.log("bye")
      document.getElementById("myform").style.display = "none";

    },

    async getTasks() {
      const email = getAuth().currentUser.email
      console.log(email)
      let teamSnap = await getDocs(query(collection(db, "users"), where("email", "==", email)));
      this.team = ""
      teamSnap.forEach(doc => {
            this.team = doc.data().team
        });
        console.log(this.team)

      let teamQuery = await getDocs(query(collection(db,"users"), where("team", "==", this.team)));
      this.teamTask = {}
      this.teamMail = {}

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
  <main class='project'>
    <div class='project-info'>
      <h1>Team Dashboard</h1>
    </div>
    <div class='project-tasks'>
        <div class='project-column' v-for="(tasks, name) in teamTask" :key='name'>
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
            <div id="nameHeading">
              <div class="circle">
                  <div class="circle-inner"><div v-if = 'teamMail'></div> {{teamMail[name][0]}} </div>
                </div>
              <div class='project-column-heading'>
                
                <h2 class='project-column-heading__title'>{{teamMail[name]}}</h2>
                  <button class='task_add' v-on:click="addTask(name)"><span>&#43;</span></button>
              </div>
            </div>

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

 .project-info {
	 display: flex;
	 width: 100%;
	 justify-content: space-between;
	 align-items: center;
}

 .project-tasks {
	 display: flex;
	 grid-template-columns: repeat(4, 1fr);
	 width: 100%;
	 grid-column-gap: 1.5rem;
}
 .project-column-heading {

	 display: flex;
	 align-items: center;
	 justify-content: space-between;
   background-color: var(--white);
    padding: 0px 10px;
	 border-radius: 8px;
	 width: 100%;
	 box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
	 margin-bottom: 1rem;
	 border: 3px dashed transparent;

}
 .project-column-heading__title {
	font-size: 20px;
  padding: 10px;
  text-transform: uppercase;
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

</style>
