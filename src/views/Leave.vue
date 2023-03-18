<template>
    
        
            <h1>Leave Dashboard <button class = "applyLeave" @click ="showForm = true"> + Apply Leave</button>
                
                    <div class="overlay" v-if="showForm">
                    <div class="modal">
                        <h5>Form Title</h5>
                        <form id= "leaveForm" @submit.prevent="submitForm">
                            <div class = "formli">
                                <label for="description"> Description: </label>
                                <input type = "text" id = "description" required = "" placeholder="Enter Description"> <br><br>
                                <label for="type"> Type of Leave: </label>
                                <select id="type">
                                <option value="">-- Please select --</option>
                                <option value="Annual">Annual</option>
                                <option value="Sick">Sick</option>
                                <option value="Urgent">Urgent</option>
                                <option value="Others">Others</option>
                                </select> <br> <br>
                                <label for="duration"> Duration </label>
                                <input type = "text" id = "duration" required = "" placeholder="Enter Start and End Date"> <br><br>
                                <label for="days"> Number of Days </label>
                                <input type = "number" id = "days" required = "" placeholder="Enter Number of Days"> <br><br>
                                <label for="employer"> Approving Employer </label>
                                <input type = "text" id = "employer" required = "" placeholder="Enter Employer Name"> <br><br>
                                

                                
                        </div>
                        <button type="submit">Submit</button>
                        <button @click="showForm = false">Close</button>
                        </form>
                    </div>
    </div>
            </h1>
            
        
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
        <ManagerLeave :key="refreshComp"/>
        
</template>

<script>
    import firebaseApp from '../firebase/index';
    import { getFirestore } from 'firebase/firestore'
    import {doc, setDoc} from "firebase/firestore";
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
      showForm: false,
      form: {
        name: '',
        email: ''
      }
    }
  },
  methods: {
            async submitForm(){
              console.log("IN AC")
            let description = document.getElementById("description").value
            let type = document.getElementById("type").value
            let duration = document.getElementById("duration").value
            let days = document.getElementById("days").value
            let employer = document.getElementById("employer").value
            
        alert(" Saving your data for Leave : " + duration)
            try {
                const docRef = await setDoc(doc(db, "Leave",undefined),{
                Email: user.email, Description: description, Type : type, Duration: duration, Days : days, Employer:employer, Status: "pending"})
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
.formli{
        display: inline-block;
        text-align: center;
        background-color: white;
        
    
    }
    form{
        text-align: center;
        align-items: center;
        margin: auto;
       
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


