<template>
    <div>
    <h1 id="Current"> My Leaves </h1>
    

    <table id = "table" class = "auto-index">
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
import firebaseApp from '../firebase/firebase.js';
import { getFirestore } from 'firebase/firestore'
import {doc, collection, getDocs, deleteDoc, query, where} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;
 console.log(user.email)

const db = getFirestore(firebaseApp);

export default {
    mounted(){

    async function display(){
    

    let allDocuments = await getDocs(query(collection(db,"Leave"), where("Email", "==", user.email)));

    let index = 1
    

    allDocuments.forEach(doc => {
        let docid = doc.id
        console.log(docid, "document ID")
        let documentData = doc.data()
        let description = documentData.Description
        let type = documentData.Type
        let duration = documentData.Duration
        let days = documentData.Days
        let employer = documentData.Employer
        let status = documentData.Status
        
    


        let table = document.getElementById("table")
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
        
        
        
                // create button element
        const deletebtn = document.createElement("button");
        deletebtn.className= "bwt"

        // create span element for button text
        const span = document.createElement("span");
        span.className="deletespan"
        span.innerText = "CONFIRM DELETE";

        // create SVG element for icon
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "25");
        svg.setAttribute("height", "25");
        svg.setAttribute("fill", "none");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");

        // create path element for SVG icon
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        path.setAttribute("d", "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16");

        // append child elements to button
        svg.appendChild(path);
        deletebtn.appendChild(span);
        deletebtn.appendChild(svg);

        
       

        cell8.appendChild(deletebtn)
        deletebtn.onclick = function() {
            deleteLeave(docid)
        }
        
        index+=1
    })
}
    display()
    async function deleteLeave(docid) {
        alert("You are going to delete Leave " + docid)
        console.log(document.body.offsetWidth)
        await deleteDoc(doc(db,"Leave", docid))
        console.log("Document successfully deleted!", docid);
        let tb = document.getElementById("table")
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



.approved {
  display: inline-flex;
  align-items: center;
  margin: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: #c6f6d5;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #059669;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.approved:hover {
  background-color: #9ae6b4;
  
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
.rejected {
  display: inline-flex;
  align-items: center;
  margin: 0.5rem;
  padding: 0.25rem 0.75rem;
  
  background-color: #f47878;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fd2626;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.rejected:hover {
  background-color: #ff0202;
  
}
.bwt {
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    border: 2px solid rgb(231, 50, 50);
    
    cursor: pointer;
    box-shadow: 0 0 10px #333;
    overflow: hidden;
    transition: .3s;
}
.bwt:hover {
    background-color: rgb(245, 207, 207);
    transform: scale(1.2);
    box-shadow: 0 0 4px #111;
    transition: .3s;
}
svg {
    color: rgb(231, 50, 50);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: .3s;
}
.bwt:focus svg {
    opacity: 0;
    transition: .3s;
}
.deletespan {
    width: 150px;
    position: absolute;
    opacity: 0;
    transform: translate(-50%, -50%);
    color: rgb(231, 50, 50);
    font-weight: 600;
    transition: .3s;
}
.bwt:focus {
    width: 150px;
    height: 50px;
    transition: .3s;
}
.bwt:focus span {
    opacity: 1;
    transition: .3s;
}
</style>



    