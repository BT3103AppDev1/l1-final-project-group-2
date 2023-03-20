<script>
import TaskCard from '../components/TaskCard.vue'

import firebaseApp from '../firebase/firebase';
import { onMounted } from 'vue';
import { getFirestore } from 'firebase/firestore'
import { collection, getDocs, deleteDoc, query, where} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const db = getFirestore(firebaseApp);

export default {
  name: "Team",
  components: {
    TaskCard
    },
  data(){
    return{
      ownTasks: [],
      task: {
        Name: '',
        Description: '',
        Due_Date: ''
      }
    }
  },
  methods: {
    async getTasks() {
    var tasksRef = await getDocs(collection(db, "Tasks"))

    this.ownTasks = [];
        tasksRef.forEach(doc => {
            var task = doc.data();
            this.ownTasks.push(task);
            console.log(this.ownTasks)
        });
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
      <div class='project-participants'>
        <span></span>
        <button class='project-participants__add'>Add Participant</button>
          
        </div>
    </div>
    <div class='project-tasks'>
      <div class='project-column'>
		<div class='project-column-heading'>
          <h2 class='project-column-heading__title'>Jane's Task</h2><button class='project-column-heading__options'><i class="fas fa-ellipsis-h"></i></button>
        </div>

        <div v-for="task in ownTasks" :key='task.id'>
            <TaskCard
              :Task='task.Name'
              :Description='task.Description'
              :DueDate='task.Due_Date'
            />
        </div>
      </div> 

      <div class='project-column'><div class='project-column-heading'>
          <h2 class='project-column-heading__title'>Tom's Task</h2><button class='project-column-heading__options'><i class="fas fa-ellipsis-h"></i></button>
        </div>
          
        </div>
      <div class='project-column'><div class='project-column-heading'>
          <h2 class='project-column-heading__title'>Dick's Task</h2><button class='project-column-heading__options'><i class="fas fa-ellipsis-h"></i></button>
        </div>
        
        </div>
      
    </div>
  </main>
</template>



<style>
 .project-info {
	 padding: 2rem 0;
	 display: flex;
	 width: 100%;
	 justify-content: space-between;
	 align-items: center;
}
 .project-participants {
	 display: flex;
	 align-items: center;
}
 .project-participants span, .project-participants__add {
	 width: 30px;
	 height: 30px;
	 display: inline-block;
	 background: grey;
	 border-radius: 100rem;
	 margin: 0 0.2rem;
}
 .project-participants__add {
	 background: transparent;
	 border: 1px dashed #969696;
	 font-size: 0;
	 cursor: pointer;
	 position: relative;
}
 .project-participants__add:after {
	 content: '+';
	 font-size: 15px;
	 color: #969696;
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
}
 .project-column-heading__title {
	 font-size: 20px;
   background-color: transparent
}
 .project-column-heading__options {
	 background: transparent;
	 color: black;
	 font-size: 18px;
	 border: 0;
	 cursor: pointer;
}

</style>
