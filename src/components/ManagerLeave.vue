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
                <th>Approving Employer</th>
                <th>Status</th>
                <th> Options</th>
            </tr>

    </table> <br>
    
</div>
</template>

<script>
import firebaseApp from '../firebase/index.js';
import { getFirestore } from 'firebase/firestore'
import {doc, collection, getDocs, deleteDoc, query, where, updateDoc} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;
 console.log("MANGER", user.email)

const db = getFirestore(firebaseApp);

export default {
    mounted(){

    async function display(){
    

    let allDocuments = await getDocs(query(collection(db,"Leave"), where("Status", "==", "pending")));
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
        let employer = documentData.Employer
        let status = documentData.Status
        let email = documentData.Email
        


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
        cell2.innerHTML = description

        cell3.innerHTML = type
        cell4.innerHTML = duration

        
    
        
        cell5.innerHTML = days
        cell6.innerHTML = employer 
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
        
        
        
        const tickbtn = document.createElement("button");
        tickbtn.className= "tickbwt"
        tickbtn.innerHTML="&#10003;"
        
        const crossbtn = document.createElement("button");
        crossbtn.className= "crossbwt"
        crossbtn.innerHTML="&#10007"
        

       

        cell8.appendChild(tickbtn)
        cell8.append(crossbtn)
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

    }
    
}
    }


</script>
<style>

h1,h2{
    text-align: center;
    background-color: rgb(129,184,99);
    font: 700;
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;

}
table{
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
    color: #050505;
    background-color: whitesmoke;
    border: none;
}
tr:nth-child(even){
    background-color: whitesmoke;
    

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
  background-color: #ffffff;
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
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #ddd;
    text-align: center;
    font-size: 16px;
    line-height: 18px;
    cursor: pointer;
    color: #fff;
    background-color: #4CAF50;
}

.crossbwt {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #ddd;
    text-align: center;
    font-size: 16px;
    line-height: 18px;
    cursor: pointer;
    color: #fff;
    background-color: #f44336;

}

</style>



    