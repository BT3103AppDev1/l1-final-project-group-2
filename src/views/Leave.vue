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
              <label for="team">Team</label>
              <select id="team" required>
                <option value="">Select Team</option>
                <option value="Marketing">Marketing</option>
                <option value="Technology">Technology</option>
              </select>

              <button class="btn" type="button" v-on:click="submitForm">Submit</button>
              <button class="btn" type="button" v-on:click="closeForm" >Close</button>
            </form>
            </div>
        </div>

            
            
        
    <div class = box>
        <div class="box1">
		    <h1>Annual Leave           <br>Remaining
                <br>
                8
            </h1>
		    
	    </div>
	    <div class="box2">
		    
		    <h1>Sick Leave           
                <br>Remaining
                <br>
                2
            </h1>
	    </div>
	    <div class="box3">
		    
		    <h1>Other Leave           
                <br>Remaining
                <br>
                2
            </h1>
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
    import {getDoc,doc, setDoc, collection} from "firebase/firestore";
    const db = getFirestore(firebaseApp);
    import { getAuth } from "firebase/auth";

        const auth = getAuth();
        const user = auth.currentUser;

    import LeaveDisplay from '../components/LeaveDisplay.vue';
    import ManagerLeave from '../components/ManagerLeave.vue';

        export default {
            name: 'OnlyLeave',
            components:{
                LeaveDisplay,
                ManagerLeave
            },
            data() {
    return {
      isManager: false
    }
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
            let team = document.getElementById("team").value
            
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
    .box{
        
        
        display: flex;
        justify-content: space-between;
       


        
    }
    .box1 h1{
        color: black;
        box-sizing: border-box;
        background-color: #FFEFE7;
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        width: 360px;
        height: 150px;
        text-align: center;
        
    
  
        
			border-radius: 10px;
    }
    .box2 h1{
        color: black;
        box-sizing: border-box;
        background-color: #e2d4f6;
        
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        width:360px;
        height: 150px;
        text-align: center;
        
    
  
        
			border-radius: 10px;
    }
    .box3 h1{
        color: black;
        box-sizing: border-box;
        background-color: #FDEBF9;
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        width: 360px;
        height: 150px;
        text-align: left;
        text-align: center;
        
    
  
        
			border-radius: 10px;
    }
    
  
		/*.box1{
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			padding: 12px 12px 12px 20px;
			gap: 16px;
			
			width: 397.73px;
			height: 171.47px;
			left: 106px;
			top: 95px;
			background: #FFEFE7;
			border-radius: 10px;
		}
		.box1 h2 {
			width: 365.73px;
			height: 56px;
			font-family: 'Poppins';
			font-style: normal;
			font-weight: 500;
			font-size: 18px;
			line-height: 28px;
			font-feature-settings: 'salt' on, 'liga' off;
			flex: none;
			order: 0;
			align-self: stretch;
			flex-grow: 0;
		}
		.box1 h1 {
			width: 365.73px;
			height: 28px;
			font-family: 'Poppins';
			font-style: normal;
			font-weight: 500;
			font-size: 36px;
			line-height: 28px;
			display: flex;
			align-items: center;
			font-feature-settings: 'salt' on, 'liga' off;
			flex: none;
			order: 1;
			align-self: stretch;
			flex-grow: 0;
		}

        .box2 {
			display: inline-block;
			width: 30%;
			height: 200px;
			background-color: #f2f2f2;
			margin: 10px;
			padding: 20px;
			box-sizing: border-box;
		}
        .box3 {
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			padding: 12px 12px 12px 20px;
			gap: 16px;
			
			width: 397.73px;
			height: 171.47px;
			left: 531.03px;
			top: 95px;
			background: #F0E8FB;
			border-radius: 10px;
		}
		.box3 h2 {
			width: 365.73px;
			height: 28px;
			font-family: 'Poppins';
			font-style: normal;
			font-weight: 500;
			font-size: 18px;
			line-height: 28px;
			font-feature-settings: 'salt' on, 'liga' off;
			flex: none;
			order: 0;
			align-self: stretch;
			flex-grow: 0;
        }
*/
</style>


