<template>
    
        
            <h1>Leave Dashboard <button class='applyLeave' v-on:click="addLeave">+ Add Leave</button></h1>
        
        <div class = "form-popup" >
          <div class = "popup" id = "myform">    
          <form action="/action_page.php" class = "formli" id="leaveForm">         
            <h3> Leave Request </h3>
              <br><br>
              <label for="type">Type of Leave</label>
              <select id="type" required>
                <option value="">Select Type of Leave</option>
                <option value="Annual">Annual</option>
                <option value="Sick">Sick</option>
                <option value="Others">Others</option>
              </select>
              <label for="description">Description</label>
              <input type="text" placeholder="Description" id="description" required>
              <label for="duration">Duration</label>
              <input type="text" placeholder="ddmmyy - ddmmyy" id="duration" required>
              <label for="days">Number of Days</label>
              <input type="number" placeholder="Num of Days" id="days" required>
              
              

              <div class="button-container">
              <button class="btn" type="button" v-on:click="submitForm">Submit</button>
             <button class="btn" type="button" v-on:click="closeForm">Close</button>
              </div>
            </form>
            </div>
        </div>
        <div class = bars>
        <div class="progress-bar-container">
          <h3>Annual Leave Taken</h3>
    <div class="progress-bar-wrapper">
      <svg class="progress-bar" width="100%" height="100%" viewBox="0 0 42 42">
        <circle class="progress-bar-background" cx="21" cy="21" r="19"></circle>
        <circle class="progress-bar-foreground" cx="21" cy="21" r="19"
          :style="{ strokeDasharray: (annualleave / 127 * 120) + ' 999' }"></circle>
      </svg>
      <div class="progress-bar-label">{{ annualleave }} / 25 days</div>
    </div>
  </div>

  <div class="progress-bar-container">
          <h3>Sick leave Leave Taken</h3>
    <div class="progress-bar-wrapper">
      <svg class="progress-bar" width="100%" height="100%" viewBox="0 0 42 42">
        <circle class="progress-bar-background" cx="21" cy="21" r="19"></circle>
        <circle class="progress-bar-foreground" cx="21" cy="21" r="19"
          :style="{ strokeDasharray: (sickleave / 14 * 120) + ' 999' }"></circle>
      </svg>
      <div class="progress-bar-label">{{ sickleave }} / 14 days</div>
    </div>
  </div>
  <div class="progress-bar-container">
          <h3>Other leave Leave Taken</h3>
    <div class="progress-bar-wrapper">
      <svg class="progress-bar" width="100%" height="100%" viewBox="0 0 42 42">
        <circle class="progress-bar-background" cx="21" cy="21" r="19"></circle>
        <circle class="progress-bar-foreground" cx="21" cy="21" r="19"
          :style="{ strokeDasharray: (otherleave / 14 * 120) + ' 999' }"></circle>
      </svg>
      <div class="progress-bar-label">{{otherleave }} / 14 days</div>
    </div>
  </div>
  </div>



            
            
        
    
    <br> <br>
    
        <LeaveDisplay :key="refreshComp"/>
        <br>
       
        <ManagerLeave v-if="isManager" />
        
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
      
      isManager: false,
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

    })
    this.annualleave = annualleave
    console.log("abc")
    this.sickleave = sickleave
    this.otherleave = otherleave
    const totalAnnualLeave = 200; // Replace with your total annual leave value
    this.progressValue = Math.round(this.annualleave / totalAnnualLeave * 100);
    this.progress = this.progressValue / 100 * 360;
    
  },
  async mounted() {
    try {
        console.log(user.uid)
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      const userData = userDoc.data();
      console.log(userData.role)
      this.isManager = userData.role === "Manager";
      
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
            let duration = document.getElementById("duration").value
            let days = document.getElementById("days").value
            const userDoc = await getDoc(doc(db, "users", user.uid));
      
            const userData = userDoc.data();
            let team = userData.team
            
        alert(" Saving your data for Leave : " + duration)
            try {
                
                const docRef = await setDoc(doc(collection(db, "Leave")),{
                Email : user.email, Description: description, Type : type, Duration: duration, Days : days, Team :team, Status: "pending"})
                console.log(docRef) 
                console.log("reset form")
                document.getElementById('leaveForm').reset();
                this.$emit("added")
            }
                catch(error) {
                console.error ("Error adding document: ", error);
                }
                this.showForm=false;
                }
            }
    }
</script>
<style>
div{
    background-color: #EBF0F7;
}
.bars{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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

.formli {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
}

.formli label {
  display: block;
  text-align: center;
  margin-bottom: 5px;
}

.formli input,
.formli select {
  width: 100%;
  padding: 10px;
  border:1px solid black;
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
}

.formli .button-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
  background-color: white;
}


  
  
 


h5{
    background-color: whitesmoke;
    text-align: center;
}
h1{
    text-align: left;
    color: black;
    background-color: white;
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

  .progress-bar-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 200px;
    background-color: white;
    color: black;
  }

  .progress-bar-wrapper {
    position: relative;
    width: 150px;
    height: 150px;
    text-align: center;
    font-size: 1.2rem;
    background-color: white;
  }

  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .progress-bar-background {
    fill: none;
    stroke: #e6e6e6;
    stroke-width: 3.8;
    color: white;
    background-color: white;
  }

  .progress-bar-foreground {
    fill: none;
    stroke: cyan;
    stroke-width: 3.8;
    stroke-linecap: round;
    stroke-dasharray: 0 999;
    transition: stroke-dasharray 0.5s ease 0s;
  }

  .progress-bar-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: black;
    background: white;
  }

  .progress-bar-background2 {
    fill: none;
    stroke: #e6e6e6;
    stroke-width: 3.8;
    color: white;
    background-color: white;
  }

  .progress-bar-foreground2 {
    fill: none;
    stroke: orange (240, 132, 0, 0.908);
    stroke-width: 3.8;
    stroke-linecap: round;
    stroke-dasharray: 0 999;
    transition: stroke-dasharray 0.5s ease 0s;
  }

  .progress-bar-background3 {
    fill: none;
    stroke: #e6e6e6;
    stroke-width: 3.8;
    color: white;
    background-color: white;
  }

  .progress-bar-foreground3 {
    fill: none;
    stroke: red (240, 132, 0, 0.908);
    stroke-width: 3.8;
    stroke-linecap: round;
    stroke-dasharray: 0 999;
    transition: stroke-dasharray 0.5s ease 0s;
  }
  
</style>



