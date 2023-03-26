<template>
  <main class='project'>
    <div class='project-info'>
      <h1>Task Dashboard</h1>
    </div>

    <div class='project-tasks'>
      <div class='project-column'>
		    <div class='project-column-heading'>
          <h2 class='project-column-heading__title'>To Do</h2>
          <button class='task_add' v-on:click="addTask">Add Task</button>
        </div>
        <div class = "form-popup" >
          <div class = "popup" id = "myform">    
            <form action="/action_page.php" class = "formli">         
              <h1> Create Task </h1>
              <br><br>
              <label for="task_name1">Input Task Name</label>
              <input type="text" placeholder="Task Name" id="task_name1" required>
              <label for="task_duedate1">Input Due Date</label>
              <input type="date" placeholder="Due Date" id="task_duedate1" required>
              <label for="task_desc1">Input Task Description</label>
              <input type="text" placeholder="Task Description" id="task_desc1" required>

              <div class="Add">
                <button class="btn" type="button" v-on:click="addtofs"> Add </button>
              </div>

              <div class="Close">
                <button class="btn" type="button" v-on:click="closeForm"> Close </button>
              </div>
            </form>
          </div>
        </div>
          
          
        <div class ="drop-zone" @drop="onDrop($event,'ToDo')" @dragover.prevent @dragenter.prevent>
          <div v-for = "(item, index) in doData" :key="index">
            <div class = "task" draggable = "true" @dragstart="startDrag($event, item)">
              <div class = "taskDisplay"> Task: </div>
              <div id = "taskName"> {{ item.name }} </div>
              <br>
              <div class = "taskDisplay"> Description: </div>
              <div id = "taskDescription"> {{ item.description }} </div>
              <br>
              <div id = "taskDuedate"> {{ item.duedate }}</div>

            </div>   

          </div>
        </div>



      </div>
      



      <div class='project-column'>
		    <div class='project-column-heading'>
          <h2 class='project-column-heading__title'>Review</h2>  
        </div>

        <div class ="drop-zone" @drop="onDrop($event,'Review')" @dragover.prevent @dragenter.prevent>
          <div v-for = "(item, index) in reviewData" :key="index">
            <div class = "task" draggable = "true" @dragstart="startDrag($event, item)">
              <div class = "taskDisplay"> Task: </div>
              <div id = "taskName"> {{ item.name }} </div>
              <br>
              <div class = "taskDisplay"> Description: </div>
              <div id = "taskDescription"> {{ item.description }} </div>
              <br>
              <div id = "taskDuedate"> {{ item.duedate }}</div>

            </div>   
          </div>
        </div>
      </div>




        <div class='project-column'>
		      <div class='project-column-heading'>
            <h2 class='project-column-heading__title'>Completed</h2>
          </div>
           
          <div class ="drop-zone" @drop="onDrop($event,'Complete')" @dragover.prevent @dragenter.prevent>
            <div v-for = "(item, index) in completeData" :key="index">
              <div class = "task">
                <div class = "taskDisplay"> Task: </div>
                <div id = "taskName"> {{ item.name }} </div>
                <br>
                <div class = "taskDisplay"> Description: </div>
                <div id = "taskDescription"> {{ item.description }} </div>
                <br>
                <div id = "taskDuedate"> {{ item.duedate }}</div>

              </div>   
            </div>
          </div>
        </div>
    </div>   
  </main>
</template>

<style>

.sidenav {
  height: 100%; /* Full-height: remove this if you want "auto" height */
  width: 100px; /* Set the width of the sidebar */
  position: fixed; /* Fixed Sidebar (stay in place on scroll) */
  z-index: 1; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 0;
  background-color: white;
  overflow-x: hidden; /* Disable horizontal scroll */;
  padding: 200px 0px;
}

.sidenav a {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: 25px;
  color: #2e2e2f;
}

 body {
	 color: #2e2e2f;
   width: 100%;
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
	 display: flex;
	 grid-template-columns: repeat(4, 1fr);
	 width: 100%;
	 grid-column-gap: 1.5rem;
}
 .project-column-heading {
	 margin-bottom: 1rem;
	 display: flex;
	 align-items: center;
	 justify-content: space-between;
   background: transparent;
	 color: black;
	 font-size: 18px;
	 border: 0;
	 cursor: pointer;
}
 .project-column-heading__title {
	 font-size: 20px;
}

 .task {
	 cursor: move;
	 background-color: var(--white);
	 padding: 1rem;
	 border-radius: 8px;
	 width: 100%;
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
	 border-radius: 100px;
	 padding: 2px 13px;
	 font-size: 12px;
	 color: var(--tag-4-text);
	 background-color: var(--tag-4);
	 width: 100%;
	 display: flex;
	 align-items: center;
	 justify-content: space-between;
}

 #taskName, #taskDescription {
	 background: transparent;
	 border: 0;
	 color: var(--light-grey);
	 font-size: 15px;
}
 #taskDuedate {
	 position: relative;
	 width: 100%;
	 color: var(--light-grey);
	 font-size: 12px;
	 margin-right: 1rem;
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
 .tag-progress {
	 margin: 1.5rem 0;
}
 .tag-progress h2 {
	 font-size: 16px;
	 margin-bottom: 1rem;
}
 .tag-progress p {
	 display: flex;
	 width: 100%;
	 justify-content: space-between;
}
 .tag-progress p span {
	 color: #b4b4b4;
}
 .tag-progress .progress {
	 width: 100%;
	 -webkit-appearance: none;
	 appearance: none;
	 border: none;
	 border-radius: 10px;
	 height: 10px;
}
 .tag-progress .progress::-webkit-progress-bar, .tag-progress .progress::-webkit-progress-value {
	 border-radius: 10px;
}
 .tag-progress .progress--copyright::-webkit-progress-bar {
	 background-color: #ecd8e6;
}
 .tag-progress .progress--copyright::-webkit-progress-value {
	 background: #d459e8;
}
 .tag-progress .progress--illustration::-webkit-progress-bar {
	 background-color: #dee7e3;
}
 .tag-progress .progress--illustration::-webkit-progress-value {
	 background-color: #46bd84;
}
 .tag-progress .progress--design::-webkit-progress-bar {
	 background-color: #d8e7f4;
}
 .tag-progress .progress--design::-webkit-progress-value {
	 background-color: #08a0f7;
}
 .task-activity h2 {
	 font-size: 16px;
	 margin-bottom: 1rem;
}
 .task-activity li {
	 list-style: none;
	 margin: 1rem 0;
	 padding: 0rem 1rem 1rem 3rem;
	 position: relative;
}
 .task-activity time {
	 display: block;
	 color: var(--light-grey);
}
 .task-icon {
	 width: 30px;
	 height: 30px;
	 border-radius: 100rem;
	 position: absolute;
	 top: 0;
	 left: 0;
	 display: flex;
	 align-items: center;
	 justify-content: center;
}
 .task-icon svg {
	 font-size: 12px;
	 color: var(--white);
}
 .task-icon--attachment {
	 background-color: #fba63c;
}
 .task-icon--comment {
	 background-color: #5dc983;
}
 .task-icon--edit {
	 background-color: #7784ee;
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
    height: 550px;
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
  }

  .formli .btn {
    padding: 12px 20px;
    background-color: #fff;
    cursor: pointer;
	  margin-bottom: 1rem;
    opacity: 0.8;
  }



  .drop-zone {
    background-color: #eee;
    margin-bottom: 10px;
    padding: 12px 20px;
    height: 550px;
    width: 300px

  }

</style>


<script>
import firebaseApp from '../firebase/firebase.js';
import {getFirestore} from "firebase/firestore"
import {doc, setDoc, getDocs, collection, updateDoc} from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
  
 data() {
   console.log('hi')
    return {
      doData: [],
      reviewData: [],
      completeData: []
   };
  }, 

  methods: {
    addTask() {
      console.log("hi")
      document.getElementById("myform").style.display = "block";
    },
    
    async addtofs() {
      let name = document.getElementById("task_name1").value 
      let due_date = document.getElementById("task_duedate1").value
      let description = document.getElementById("task_desc1").value

      try{
        const docRef = await setDoc(doc(db, "Tasks", name), {
          Name: name, Due_Date: due_date, Description: description, Status: "ToDo"
        
        })
        console.log(docRef)
        document.getElementById("task_name1").value = "";
        document.getElementById("task_duedate1").value = "";
        document.getElementById("task_desc1").value = "";
        this.$emit("added")

      }
      catch(error) {
        console.error("Error adding document: ", error);
      }
    },

    closeForm() {
      console.log("bye")
      document.getElementById("myform").style.display = "none";

    },

    async readTasks() {
      this.doData = [];
      this.reviewData = [];
      this.completeData = [];
      let allDocuments = await getDocs(collection(db, "Tasks"))
      allDocuments.forEach((docs) => {
        let documentData = docs.data()

        let name = (documentData.Name)
        let description = (documentData.Description)
        let duedate = (documentData.Due_Date)
        let status = (documentData.Status)

        
        if (status == "ToDo") {
          console.log(status)

          this.doData.push(
          {name: name, description:description ,duedate:duedate, status:status});
        }

        if (status == "Review") {
          console.log(status)

          this.reviewData.push(
          {name: name, description:description ,duedate:duedate, status:status});
        }

        if (status == "Complete") {
          console.log(status)

          this.completeData.push(
          {name: name, description:description ,duedate:duedate, status:status});
        }

        
      })

    },

    startDrag(evt, item) {
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('itemName', item.name)
      console.log('.')
    },

    async onDrop(evt, status) {
      const itemName = evt.dataTransfer.getData('itemName')
      try {
          const update = await updateDoc(doc(db, "Tasks", itemName), {
           Status: status

        })
        this.$emit("changedStatus")
      }
      

      catch(error) {
        console.error("Error adding document: ", error);
      }

      console.log(status)
    }
    


  },

  mounted(){
    this.readTasks();
  }
}


</script>