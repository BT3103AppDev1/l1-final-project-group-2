<template>
    <div>
    <h1 id="Current Pending"> Pending Leave Requests</h1>
    

    <table id = "pending table" class = "auto-index">
        <tr>
                <th>S.No</th>
                <th>Description</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Days</th>
                <th>Status</th>
                <th> Options</th>
            </tr>

    </table> <br>
    
</div>
</template>

<script>
import firebaseApp from '../firebase/firebase.js';
import { getFirestore } from 'firebase/firestore'
import {doc, collection, getDocs, deleteDoc, query, where, updateDoc, getDoc} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;
 console.log("MANaGER", user.email)

const db = getFirestore(firebaseApp);
const userDoc = await getDoc(doc(db, "users", user.uid));
      
      const userData = userDoc.data();
      console.log(userData.team)
const team = userData.team


export default {
    mounted(){

    async function display(){
    
    
    let allDocuments = await getDocs(query(collection(db,"Leave"), where("Status", "==", "pending"), where("Team", "==",team)));
    console.log("manager")

    let index = 1
    

    allDocuments.forEach(doc => {
        console.log("pending")
        let docid = doc.id
        let documentData = doc.data()
        let description = documentData.Description
        let type = documentData.Type
        let duration = documentData.Duration
        let days = documentData.Days
        
        let status = documentData.Status
        
        


        let table = document.getElementById("pending table")
        let row = table.insertRow(index)
        let cell1= row.insertCell(0)
        let cell2= row.insertCell(1)
        let cell3= row.insertCell(2)
        let cell4= row.insertCell(3)
        let cell5= row.insertCell(4)
        
        let cell6= row.insertCell(5)
        let cell7= row.insertCell(6)

        cell1.innerHTML = index
        cell2.innerHTML = description

        cell3.innerHTML = type
        cell4.innerHTML = duration
        cell5.innerHTML = days
        console.log(status)
        let badge = document.createElement('span');
        if (status=="pending") {
            console.log("inside pending")
            badge.className = "pending";
            badge.textContent = status;
            
        // code to execute if condition1 is true
        } else if (status=="approved") {
            console.log("inside approved")
            
            badge.className = "approved";
            badge.textContent = status;
        // code to execute if condition2 is true
        } else {
            console.log("inside rejected")
            badge.className = "rejected";
            badge.textContent = status;
        // code to execute if all conditions are false
        }
        
        cell6.appendChild(badge)
        const buttonContainer = document.createElement("div")
        buttonContainer.className = "button-container"

        const tickbtn = document.createElement("button");
        tickbtn.className = "tickbwt"
        tickbtn.innerHTML = "&#10003;"

        const crossbtn = document.createElement("button");
        crossbtn.className = "crossbwt"
        crossbtn.innerHTML = "&#10007"

        buttonContainer.appendChild(tickbtn)
        buttonContainer.appendChild(crossbtn)

        cell7.appendChild(buttonContainer)
        crossbtn.onclick = function() {
            rejectLeave(docid)
        }
        tickbtn.onclick = function() {
            approveLeave(docid)
        }
        
        index+=1
    })
}
    display()
    async function rejectLeave(docid) {
        alert("You are going to reject Leave " + docid)
        console.log(document.body.offsetWidth)
        await updateDoc(doc(db, 'Leave', docid), {Status: "rejected"});
        console.log("Document successfully rejected!", docid);
        let tb = document.getElementById("pending table")
        while(tb.rows.length > 1) {
            tb.deleteRow(1)
        }
        
        display()
        location.reload()
    }
    async function approveLeave(docid) {
        alert("You are going to approve Leave " + docid)
        await updateDoc(doc(db, 'Leave', docid), {Status: "approved"});
        console.log("Document successfully approved!", docid);
        let tb = document.getElementById("pending table")
        while(tb.rows.length > 1) {
            tb.deleteRow(1)
        }
        
        display()
        location.reload()

    }
    
}
    }


</script>
<style>
div {
    background-color: white;
}

h1{
    text-align: left;
    color: black;
    background-color: white;
}



table{
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
    color: #050505;
    background-color: white;
    border: none;
}
#pending table tr{
    background-color: white;
    

}

th,td {
    border: solid 1px;
    border-left: none;
    border-right: none;
    border-top: none;
    border-bottom: none;
    text-align: center;
    padding: 8px;
}

.pending {
  display: inline-flex;
  align-items: center;
  margin: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: whitesmoke;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #979797;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.pending:hover {
  background-color: #8e8e8e;
  
}



.tickbwt {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgb(42, 244, 42);
  color: white;
  border: none;
  font-size: 16px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
}

.crossbwt {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgb(244, 42, 42);
  color: white;
  border: none;
  font-size: 16px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;

}
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background-color: white;
}





</style>



    