<template>
    <div id="leavePage">
        
            <h1>Leave Dashboard <button class='applyLeave' v-on:click="addLeave" >+ Request Leave</button></h1>
            <br><br>
        
        <div class = "form-popup" >
          <div class = "popup" id = "myform">
            
          <form action="/action_page.php" class = "formli" id="leaveForm">         
            <h2> Leave Request </h2>
            <br>
              
              <label for="type">Type of Leave</label>
<select id="type" required onchange="this.style.color = 'black';">
  <option value="" style="color:gray;">Select Type of Leave</option>
  <option value="Annual" style="color:black;">Annual</option>
  <option value="Sick" style="color:black;">Sick</option>
  <option value="Others" style="color:black;">Others</option>
</select>
              <label for="description">Description</label>
              <input type="text" placeholder="Description" id="description" required>
              <label for="startdate">Input Start Date</label>
              <input type="date" placeholder="Start Date" id="startdate" required>
              <label for="enddate">Input Due Date</label>
              <input type="date" placeholder="End Date" id="enddate" required>
              <label for="days">Number of Days</label>
              <input type="number" placeholder="Num of Days" id="days" required min="1">
              
              

              
              <button class="btn" type="button" v-on:click="submitForm">Submit</button>
              <div class="Close">
                <button class="btn_close" type="button" v-on:click="closeForm"><span>&times;</span></button>
              </div>
             
              
            </form>
            </div>
        </div>
        <div class = bars>
        <div class="progress-bar-container progress-bar-container-1">
          <h3>Annual Leave Taken</h3>
    <div class="progress-bar-wrapper progress-bar-wrapper-1">
      <svg class="progress-bar" width="100%" height="100%" viewBox="0 0 42 42">
        <circle class="progress-bar-background progress-bar-background-1" cx="21" cy="21" r="19"></circle>
        <circle class="progress-bar-foreground progress-bar-foreground-1" cx="21" cy="21" r="19"
          :style="{ strokeDasharray: (annualleave / 21 * 120) + ' 999' }"></circle>
      </svg>
      <div class="progress-bar-label progress-bar-label-1">{{ annualleave }} / 21 days</div>
    </div>
  </div>

  <div class="progress-bar-container progress-bar-container-2">
          <h3>Sick Leave Taken</h3>
    <div class="progress-bar-wrapper progress-bar-wrapper-2">
      <svg class="progress-bar" width="100%" height="100%" viewBox="0 0 42 42">
        <circle class="progress-bar-background progress-bar-background-2" cx="21" cy="21" r="19"></circle>
        <circle class="progress-bar-foreground progress-bar-foreground-2" cx="21" cy="21" r="19"
          :style="{ strokeDasharray: (sickleave / 14 * 120) + ' 999' }"></circle>
      </svg>
      <div class="progress-bar-label progress-bar-label-2">{{ sickleave }} / 14 days</div>
    </div>
  </div>
  <div class="progress-bar-container progress-bar-container-3">
          <h3>Other Leave Taken</h3>
    <div class="progress-bar-wrapper progress-bar-wrapper-3">
      <svg class="progress-bar" width="100%" height="100%" viewBox="0 0 42 42">
        <circle class="progress-bar-background progress-bar-background-3" cx="21" cy="21" r="19"></circle>
        <circle class="progress-bar-foreground progress-bar-foreground-3" cx="21" cy="21" r="19"
          :style="{ strokeDasharray: (otherleave / 14 * 120) + ' 999' }"></circle>
      </svg>
      <div class="progress-bar-label progress-bar-label-3">{{otherleave }} / 14 days</div>
    </div>
  </div>
  </div>



            
            
        
    
    <br> <br>
    
        <LeaveDisplay :key="refreshComp"/>
        <br>
       
        <ManagerLeave v-if="isEmployer" />
        <br>

        </div>
        
</template>

<script>
    import firebaseApp from '../firebase/firebase';
    import { getFirestore } from 'firebase/firestore'
    import {getDoc,getDocs,doc, setDoc, collection, query, where} from "firebase/firestore";
    const db = getFirestore(firebaseApp);
    import { getAuth } from "firebase/auth";
    
    

        const auth = getAuth();
        const user = auth.currentUser;
        console.log("checking getauth" + user.email)

    import LeaveDisplay from '../components/LeaveDisplay.vue';
    import ManagerLeave from '../components/ManagerLeave.vue';
    


        export default {
            name: 'OnlyLeave',
            components:{
                LeaveDisplay,
                ManagerLeave,
                
            },
            data() {
    return {
      
      isEmployer: false,
      annualleave: null,
      sickleave: null,
      otherleave: null,
      progress: 0,
      progressValue: 0
    }
    
  },
  async created(){
    let allDocuments = await getDocs(query(collection(db,"Leave"), where("Email", "==", user.email)));
    let annualleave = 0
    let sickleave =0
    let otherleave = 0

    allDocuments.forEach(doc => {
      let documentData = doc.data()
        
        let type = documentData.Type
        
        let days = parseInt(documentData.Days)
        
        let status = documentData.Status

        if (status == "approved" ) {
          if (type == "Annual") {
            annualleave += days
            console.log("annual days " + days)
          } else if (type == "Sick") {
            sickleave += days
          } else {
            otherleave+= days
          }
        }
        this.annualleave = annualleave
    console.log("abc")
    this.sickleave = sickleave
    this.otherleave = otherleave

    })
    
    
  },
  async mounted() {
    try {
        console.log(user.uid)
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      const userData = userDoc.data();
      console.log(userData.role)
      this.isEmployer = userData.role === "Employer";
      
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  },
  methods: {
    addLeave() {
      console.log("hi")
      document.getElementById("myform").style.display = "block";
    },
    closeForm() {
      console.log("bye")
      document.getElementById("myform").style.display = "none";

    },
            async submitForm(){
              console.log("IN AC")
            let description = document.getElementById("description").value
            let type = document.getElementById("type").value
            let duration = document.getElementById("startdate").value + " - " + document.getElementById("enddate").value

            let days = document.getElementById("days").value
            const userDoc = await getDoc(doc(db, "users", user.uid));
      
            const userData = userDoc.data();
            let team = userData.team
            let name = userData.name
            let email= userData.email
            
        alert(" Saving your data for Leave : " + duration)
            try {
                
                const docRef = await setDoc(doc(collection(db, "Leave")),{
                Email: email, Name: name, Description: description, Type : type, Duration: duration, Days : days, Team :team, Status: "pending"})
                console.log(docRef) 
                console.log("reset form")
                document.getElementById('leaveForm').reset();
                this.$emit("added")
            }
                catch(error) {
                console.error ("Error adding document: ", error);
                }
                this.showForm=false;
                location.reload();
                
              }
            }
    }
</script>
<style scoped>

h1{
  background-color: #EBF0F7;
}
h1 button {
    color: black;
  }

  #leavePage {
    margin-left: 100px
  }

  







.bars{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: #EBF0F7;
}
.form-popup{
    position:relative;
    text-align: center;
    width: 100%;
  }



  .popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: [form width];
    height: [form height];
    padding: [form padding];
    margin: [form margin];
    background-color: #fff;
}
.Close {
    position: absolute;
    top: 0;
    right: 0;
  }

  .btn_close {
    background-color: transparent;
    color: black;
    font-size: 30px;
    border:none !important;
  }


.formli {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  height:620px !important;
}

.formli label {
  display: block;
  text-align: center;
  margin-bottom: 5px;
}

.formli input, .formli select {
  width: 100%;
  padding: 10px;
  border:1px solid black !important;
  border-radius: 3px;
  margin-bottom: 10px;
  box-sizing: border-box;
  text-align: center;
  background-color: white;
}

.formli button {
  padding: 10px 20px;
  border: 1px solid black;
  border-radius: 3px;
  margin-top: 10px;
  cursor: pointer;
  
  /* New styles for displaying buttons on the same row with space in between */
  display: inline-block;
  width: 48%;
  margin-right: 4%;
  box-sizing: border-box;
  color: black;
  background-color: white;
}


  
  
 





select option:checked {
  color: black;
}
.applyLeave{
  align-items: center;
  appearance: none;
  background-color: #fff;
  border-radius: 24px;
  border-style: none;
  box-shadow: rgba(0, 0, 0, .2) 0 3px 5px -1px,rgba(0, 0, 0, .14) 0 6px 10px 0,rgba(0, 0, 0, .12) 0 1px 18px 0;
  box-sizing: border-box;
  color: #3c4043;
  cursor: pointer;
  display: inline-flex;
  fill: currentcolor;
  font-family: "Google Sans",Roboto,Arial,sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 32px;
  justify-content: center;
  letter-spacing: .25px;
  line-height: normal;
  max-width: 100%;
  overflow: visible;
  padding: 2px 24px;
  position: relative;
  text-align: center;
  text-transform: none;
  transition: box-shadow 280ms cubic-bezier(.4, 0, .2, 1),opacity 15ms linear 30ms,transform 270ms cubic-bezier(0, 0, .2, 1) 0ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: auto;
  will-change: transform,opacity;
  z-index: 0;
  float:right;
}
.applyLeave:hover {
  background: #F6F9FE;
  color: #174ea6;
}
.applyLeave:active {
  box-shadow: 0 4px 4px 0 rgb(60 64 67 / 30%), 0 8px 12px 6px rgb(60 64 67 / 15%);
  outline: none;
}
.applyLeave:focus {
  outline: none;
  border: 2px solid #4285f4;
}

.progress-bar-container-1 h3 {
  text-align: left;
}

  .progress-bar-container-1 {
    display: flex;
  justify-content: space-between;
  
    display: flex;

    
    justify-content: center;
    
    height: 200px;
    
    color: black;
   
  background-color: #FFEFE7;
  padding: 20px; /* add some padding to the container */
  border-radius: 10px;

}

.progress-bar-container-2 {
  display: flex;
  justify-content: space-between;
  
    display: flex;

    
    justify-content: center;
    
    height: 200px;
    
    color: black;
   
   
  background-color: #F0E8FB;
  padding: 20px; /* add some padding to the container */
  border-radius: 10px;

}


.progress-bar-container-3 {
  display: flex;
  justify-content: space-between;
  
    display: flex;

    
    justify-content: center;
    
    height: 200px;
    
    color: black;
   
  background-color: #FDEBF9;
  padding: 20px; /* add some padding to the container */
  border-radius: 10px;

}
  

  .progress-bar-wrapper-1 {
    position: relative;
    width: 150px;
    height: 150px;
    text-align: center;
    font-size: 1.2rem;
    background-color:default;
    display: flex;
  align-items: flex-start;
  background-color: #FFEFE7;
  }

  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .progress-bar-background-1 {
    fill: none;
    stroke: #e6e6e6;
    stroke-width: 3.8;
    color: #FFEFE7;
    background-color: #FFEFE7;
  }

  .progress-bar-foreground-1 {
    fill: none;
    stroke: #FF5151;
    stroke-width: 3.8;
    stroke-linecap: round;
    stroke-dasharray: 0 999;
    transition: stroke-dasharray 0.5s ease 0s;
  }

  .progress-bar-label-1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: black;
    background: #FFEFE7;
  }

  .progress-bar-wrapper-2 {
    position: relative;
    width: 150px;
    height: 150px;
    text-align: center;
    font-size: 1.2rem;
    background-color:default;
    display: flex;
  align-items: flex-start;
  background-color:  #F0E8FB;
;
  }

  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .progress-bar-background-2 {
    fill: none;
    stroke: #e6e6e6;
    stroke-width: 3.8;
    color: #FFEFE7;
    background-color: #F0E8FB;
  }

  .progress-bar-foreground-2 {
    fill: none;
    stroke: #3786F1;
    stroke-width: 3.8;
    stroke-linecap: round;
    stroke-dasharray: 0 999;
    transition: stroke-dasharray 0.5s ease 0s;
  }

  .progress-bar-label-2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: black;
    background: #F0E8FB;
  }
  .progress-bar-wrapper-3 {
    position: relative;
    width: 150px;
    height: 150px;
    text-align: center;
    font-size: 1.2rem;
    background-color:default;
    display: flex;
  align-items: flex-start;
  background-color:  #FDEBF9;
;
  }

  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .progress-bar-background-3 {
    fill: none;
    stroke: #e6e6e6;
    stroke-width: 3.8;
    color: #FFEFE7;
    background-color: #FDEBF9;
  }

  .progress-bar-foreground-3 {
    fill: none;
    stroke: #EE61CF;
    stroke-width: 3.8;
    stroke-linecap: round;
    stroke-dasharray: 0 999;
    transition: stroke-dasharray 0.5s ease 0s;
  }

  .progress-bar-label-3 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: black;
    background: #FDEBF9;
  }

</style>



