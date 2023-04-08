<template>
    <div>
    <h1 id="Current Pending"> Pending Leave Requests</h1>
    

    <table id = "pending table" class = "auto-index">
        <tr>
                <th>S.No</th>
                <th>Employee Name</th>
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
        

        async function display() {
  let allDocuments = await getDocs(query(collection(db, "Leave"), where("Status", "==", "pending"), where("Team", "==", team)));
  let index = 1;


  allDocuments.forEach((doc) => {
    let docid = doc.id;
  
        let documentData = doc.data()
        let description = documentData.Description
        let type = documentData.Type
        let duration = documentData.Duration
        let days = documentData.Days
        
        let status = documentData.Status
        let name = documentData.Name
        
        


        let table = document.getElementById("pending table")
        
        
        let row = table.insertRow(index)
        let cell1= row.insertCell(0)
        let cell2= row.insertCell(1)
        let cell3= row.insertCell(2)
        let cell4= row.insertCell(3)
        let cell5= row.insertCell(4)
        
        let cell6= row.insertCell(5)
        let cell7= row.insertCell(6)
        let cell8= row.insertCell(7)

        cell1.innerHTML = index
        cell2.innerHTML = name
        cell3.innerHTML = description

        cell4.innerHTML = type
        cell5.innerHTML = duration
        cell6.innerHTML = days
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
        
        cell7.appendChild(badge)
        const btnContainer = document.createElement("div")
        btnContainer.className = "btn-container"

        const tickbtn = document.createElement("button");
        tickbtn.className = "tickbwt"
        tickbtn.innerHTML = "&check;"

        const crossbtn = document.createElement("button");
        crossbtn.className = "crossbwt"
        crossbtn.innerHTML = "&#10005"

        btnContainer.appendChild(tickbtn)
        btnContainer.appendChild(crossbtn)

        cell8.appendChild(btnContainer)
        crossbtn.onclick = function() {
            rejectLeave(docid,name)
        }
        tickbtn.onclick = function() {
            approveLeave(docid,name)
        }
        
        index+=1
    })
}
    let tb = document.getElementById("pending table")
    while(tb.rows.length > 1) {
            tb.deleteRow(1)
    }
    display()
    async function rejectLeave(docid,name) {
        alert("You are going to reject Leave for " + name)
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
    async function approveLeave(docid,name) {
        alert("You are going to approve Leave for " + name)
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





table{
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
    color: #050505;
    background-color: white;
    
    
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
th {
  border-bottom: 1px solid rgb(199, 199, 199)!important;
  color: rgb(173, 173, 173);
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
  background-color: rgb(0, 0, 0);
  color: white;
  border: none;
  font-size: 16px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  padding:0%
}

.crossbwt {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
  border: none;
  font-size: 16px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  padding:0%

}
.btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background-color: white;
}





</style>



    