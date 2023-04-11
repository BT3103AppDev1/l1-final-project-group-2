<template>
  <main class='project'>
    <!-- page heading -->
    <div class='project-info'>
      <h1>Task Dashboard</h1>
      <!-- User initial profile circle -->
      <div class="profile_circle">
        <div class="profile_circle-inner"><div v-if = 'userEmail'></div> {{userEmail[0]}} </div>
      </div>
    </div>
    
    <div class='project-tasks'>
      <div class='project-column'>
		    <div class='project-column-heading'>
          <!-- todo column with add task button -->
          <h2 class='project-column-heading__title'>To Do</h2>
          <button class='task_add' v-on:click="addTask"><span>&#43;</span></button>
        </div>
        <!-- form to add task -->
        <div class = "form-popup" >
          <div class = "popup" id = "myform">    
            <form action="/action_page.php" class = "formli">         
              <h1> Create Task </h1>
              <br>
              <label for="task_name1">Input Task Name</label>
              <input type="text" placeholder="Task Name" id="task_name1" required>
              <label for="task_duedate1">Input Due Date</label>
              <input type="date" placeholder="Due Date" id="task_duedate1" required>
              <label for="task_desc1">Input Task Description</label>
              <textarea placeholder="Task Description" id="task_desc1" required></textarea>
              <br>
              <div class="Add">
                <button class="btn_add" type="button" v-on:click="addtofs"> Add </button>
              </div>

              <div class="Close">
                <button class="btn_close" type="button" v-on:click="closeForm"><span>&times;</span></button>
              </div>
            </form>
          </div>
        </div>
          
        <!-- display user's todo task, allowing user to drag/drop to add/remove tasks -->
        <div class ="drop-zone" @drop="onDrop($event,'ToDo')" @dragover.prevent @dragenter.prevent>
          <div v-for = "(item, index) in doData" :key="index">
            <div class = "task" draggable = "true" @dragstart="startDrag($event, item)">
              <div class = "taskDisplay"> Task </div>
              <div id = "taskName"> {{ item.name }} </div>
              <br>
              <div class = "taskDisplay"> Description </div>
              <div id = "taskDescription"> {{ item.description }} </div>
              <br>
              <div id = "taskDuedate"> {{ item.duedate }}</div>
            </div>   
          </div>
        </div>
      </div>
      



      <div class='project-column'>
		    <div class='project-column-heading'>
          <!-- review column -->
          <h2 class='project-column-heading__title'>Review</h2>  
        </div>
        <!-- display user's review task, allowing user to drag/drop to add/remove tasks -->
        <div class ="drop-zone" @drop="onDrop($event,'Review')" @dragover.prevent @dragenter.prevent>
          <div v-for = "(item, index) in reviewData" :key="index">
            <div class = "task" draggable = "true" @dragstart="startDrag($event, item)">
              <div class = "taskDisplay"> Task </div>
              <div id = "taskName"> {{ item.name }} </div>
              <br>
              <div class = "taskDisplay"> Description </div>
              <div id = "taskDescription"> {{ item.description }} </div>
              <br>
              <div id = "taskDuedate"> {{ item.duedate }}</div>

            </div>   
          </div>
        </div>
      </div>




        <div class='project-column'>
		      <div class='project-column-heading'>
            <!-- completed column -->
            <h2 class='project-column-heading__title'>Completed</h2>
          </div>
          <!-- display user's completed task, allowing user to drop to add tasks -->
          <div class ="drop-zone" @drop="onDrop($event,'Complete')" @dragover.prevent @dragenter.prevent>
            <div v-for = "(item, index) in completeData" :key="index">
              <div class = "task">
                <div class = "taskDisplay"> Task </div>
                <div id = "taskName"> {{ item.name }} </div>
                <br>
                <div class = "taskDisplay"> Description </div>
                <div id = "taskDescription"> {{ item.description }} </div>
                <br>
                <div id = "taskDuedate"> {{ item.duedate }}</div>
                <!-- task delete button so user can delete completed tasks -->
                <button class='task_delete' v-on:click="deleteTask(item.id)"><span>&#8854;</span></button>
              </div>   
            </div>
          </div>
        </div>
    </div>   
  </main>
</template>

<style>

html {
  background-color:var(--bg);
}

.project {
  margin-left: 100px
}



 h1 {
	 font-size: 30px;
}
 .project-info {
	 padding: 2rem 0;
	 display: flex;
	 width: 100%;
	 justify-content: space-between;
	 align-items: center;
}

 .project-tasks {
	 display: grid;  
   	grid-template-columns: auto auto auto;
	  width: auto; 
	  grid-column-gap: 3rem;
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

 .task {
	 cursor: move;
	 background-color: var(--white);
	 padding: 1rem;
	 border-radius: 8px;
	 width: auto;
	 box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
	 margin-bottom: 1rem;
	 border: 3px dashed transparent;
}
 .task:hover {
	 box-shadow: rgba(99, 99, 99, 0.3) 0px 2px 8px 0px;
	 border-color: rgba(162, 179, 207, .2) !important;
}
 .task p {
	 font-size: 14px;
	 margin: 1.2rem 0;
}
 .taskDisplay {
  background: transparent;
	 border: 0;
	 color: black;
	 font-size: 15px;
   text-decoration-line: underline;
}

 #taskName, #taskDescription {
	 background: transparent;
	 border: 0;
	 color: black;
	 font-size: 15px;
}
 #taskDuedate {
	 position: relative;
   width: 35%;
   padding: 2px;
	 color: black;
	 font-size: 12px;
	 margin-right: 1rem;
   border: 1px solid var(--light-grey);
   border-radius: 3px;
}

 .task-hover {
	 border: 3px dashed var(--light-grey) !important;
}
 .task-details {
	 width: 24%;
	 border-left: 1px solid #d9e0e9;
	 display: inline-block;
	 height: 100%;
	 vertical-align: top;
	 padding: 3rem 2rem;
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
    top: 10%;
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

  .btn_add {
    padding: 10px 25px;
    background-color: white;
    color: black;
    border: 2px solid #999999;
    font-size:medium;
    cursor: pointer;
	  margin-bottom: 1rem;
    opacity: 0.8;
  }

  .Close {
    position: absolute;
    top: 0;
    right: 0;
  }

  .btn_close {
    background-color: transparent;
    color: black;
    font-size: 30px
  }



  .drop-zone {
    background-color: transparent;
    margin-bottom: 10px;
    height: 550px;
    width: auto;

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

  .profile_circle {
    position: absolute;
    top: 0;
    right: 0;
    /* display: inline-block;  */
    background-color: var(--light-grey);
    margin: 10px; 
    border-radius: 50%;
    margin-top: 2rem;
  }

  
  .profile_circle-inner {
  text-transform: capitalize;
  color: black;
  display: table-cell; 
  vertical-align: middle;  
  text-align: center;
  text-decoration: none;
  height: 60px; 
  width: 60px;   
  font-size: 20px; 
}

</style>


<script>
import firebaseApp from '../firebase/firebase.js';
import {getFirestore} from "firebase/firestore"
import {doc, setDoc, getDocs, deleteDoc, collection, updateDoc} from "firebase/firestore";

import { getAuth } from "firebase/auth";


const auth = getAuth();
const user = auth.currentUser;
const db = getFirestore(firebaseApp); 

export default {
  
 data() {
    return {
      doData: [],
      reviewData: [],
      completeData: [],
      userEmail: ''
   };
  }, 

  methods: {


    addTask() {
      // open task form
      document.getElementById("myform").style.display = "block";
    },
    
    async addtofs() {
      let name = document.getElementById("task_name1").value 
      let due_date = document.getElementById("task_duedate1").value
      let description = document.getElementById("task_desc1").value


      try{
        // add inputs from task form to firestore database 
        const docRef = await setDoc(doc(collection(db, "Tasks")), {
          Name: name, Due_Date: due_date, Description: description, Status: "ToDo", Assignee: this.userEmail, Assigner: this.userEmail 
        })
        alert('Task successfully added')
        // reset form to blank
        document.getElementById("task_name1").value = "";
        document.getElementById("task_duedate1").value = "";
        document.getElementById("task_desc1").value = "";
        // refresh the page to display the newly added task
        this.$emit("added")

      }
      catch(error) {
        console.error("Error adding document: ", error);
      }
    },

    closeForm() {
      // close task form
      document.getElementById("myform").style.display = "none";

    },

    async readTasks() {

      this.doData = [];
      this.reviewData = [];
      this.completeData = [];

      // get all the tasks from the current user & store tasks according to status to display in different columns
      let allDocuments = await getDocs(collection(db, "Tasks"))

      allDocuments.forEach((docs) => {

      auth.onAuthStateChanged((user) => {
        if (user){
        let documentData = docs.data()
        this.userEmail = user.email


        if (documentData.Assignee == user.email) {
        let id = (docs.id)
        let name = (documentData.Name)
        let description = (documentData.Description)
        let duedate = (documentData.Due_Date)
        let status = (documentData.Status)

        
        if (status == "ToDo") {
          this.doData.push(
          {id:id, name: name, description:description ,duedate:duedate, status:status});
        }

        if (status == "Review") {
          this.reviewData.push(
          {id:id, name: name, description:description ,duedate:duedate, status:status});
        }

        if (status == "Complete") {
          this.completeData.push(
          {id:id, name: name, description:description ,duedate:duedate, status:status});
        }

        
      }}
    })
    })

    },

    startDrag(evt, item) {
      // save item that is dragged 
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('itemId', item.id)
    },

    async onDrop(evt, status) {
      //get item that is dragged and updated status to where it is dropped
      const itemId = evt.dataTransfer.getData('itemId')
      try {
          const update = await updateDoc(doc(db, "Tasks", itemId), {
           Status: status

        })
        // refresh after dropping to display task in the updated column 
        this.$emit("changedStatus")
      }
      

      catch(error) {
        console.error("Error adding document: ", error);
      }
    },

    async deleteTask(itemId) {
      // delete task from database & refresh to remove the task from column

      await deleteDoc(doc(db,"Tasks", itemId))
      alert('Task successfully deleted')
      this.$emit("deleted")
  },
},

  mounted(){
    // display all tasks
    this.readTasks();
  }
}


</script>