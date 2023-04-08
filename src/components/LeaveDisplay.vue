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
        
        
        
                // create button element
        const deletebtn = document.createElement("button");
        
        deletebtn.className = "bwt"
        deletebtn.innerHTML = "&#8722;"
        
        
       

        cell7.appendChild(deletebtn)
        deletebtn.onclick = function() {
            deleteLeave(docid)
        }
        
        index+=1
    })
}
    display()
    async function deleteLeave(docid) {
        alert("You are going to delete Leave")
        console.log(document.body.offsetWidth)
        await deleteDoc(doc(db,"Leave", docid))
        console.log("Document successfully deleted!", docid);
        let tb = document.getElementById("table")
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

#table th {
    border-bottom: 1px solid rgb(199, 199, 199)!important;
    color: rgb(173, 173, 173);
}


table{
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
    color: #050505;
    background-color: white;
    border: none;
}


#table tr {
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



#table .approved {
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

#table .approved:hover {
  background-color: #9ae6b4;
  
}
#table .pending {
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

#table .pending:hover {
  background-color: #8e8e8e;
  
}
#table .rejected {
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

#table .rejected:hover {
  background-color: #ff0202;
  
}
.bwt {
  
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

</style>



    