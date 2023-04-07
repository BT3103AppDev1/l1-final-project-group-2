
              
<template>
  <div class='task'>
    <div class = "taskDisplay"> Task </div>
    <div id = "taskName"> {{Task}} </div>
    <br>
    <div class = "taskDisplay"> Description </div>
    <div id = "taskDescription"> {{Description}} </div>
    <br>
    <div id = "taskDuedate"> {{DueDate }}</div>
  </div>
  
</template>

<script>
 
 export default {
	name: 'TaskCard',
	props: {
		Task: {
			type: String,
		},
		Description: {
			type: String,
		},
		DueDate: {
			type: String
		}
	},
  };

</script>


<style>
 
 .task {
	cursor: default;
	 background-color: var(--white);
	 padding: 1rem;
	 border-radius: 8px;
	 width: 100%;
	 box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
	 margin-bottom: 1rem;
	 border: none;
	 font-weight: 500;
}
 .task p {
	 font-size: 14px;
	 
	 
}
 .taskDisplay {
  	background: transparent;
	border: 0;
	color: var(--text);
	font-size: 15px;
   	text-decoration-line: underline;
}

 #taskName, #taskDescription {
	 background: transparent;
	 border: 0;
	 color: var(--text);
	 font-size: 15px;
}
 #taskDuedate {
	position: relative;
   	width: 35%;
   	padding: 5px;
	color: var(--text);
	font-size: 12px;
	margin-right: 1rem;
   	border: 1px solid var(--light-grey);
   	border-radius: 3px;
}

 .task-details {
	 width: 24%;
	 border-left: 1px solid #d9e0e9;
	 display: inline-block;
	 height: 100%;
	 vertical-align: top;
	 padding: 3rem 2rem;
	 color: var(--text);
	 
}


</style>