

<template>
  <div class='task' draggable='true'>
		<p><u>Task</u></p>
      	<p>{{Task}}</p>
		<p><u>Description</u></p>
      	<p>{{Description}}</p>
		<div id="date-box">
			<p>{{DueDate}}</p>
		</div>

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
	 cursor: move;
	 background-color: var(--white);
	 padding: 1rem;
	 border-radius: 8px;
	 width: 100%;
	 box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
	 margin-bottom: 1rem;
	 border: 3px dashed transparent;
}
 .task:hover {
	 box-shadow: rgba(99, 99, 99, 0.3) 0px 2px 8px 0px;
	 border-color: rgba(162, 179, 207, .2) !important;
}
 .task p {
	 font-size: 14px;
	 margin: 1.2rem 0;
}
 .taskDisplay {
	 border-radius: 100px;
	 padding: 2px 13px;
	 font-size: 12px;
	 color: var(--tag-4-text);
	 background-color: var(--tag-4);
	 width: 100%;
	 display: flex;
	 align-items: center;
	 justify-content: space-between;
}

 #taskName, #taskDescription {
	 background: transparent;
	 border: 0;
	 color: var(--light-grey);
	 font-size: 15px;
}
 #taskDuedate {
	 position: relative;
	 width: 100%;
	 color: var(--light-grey);
	 font-size: 12px;
	 margin-right: 1rem;
}
 .task__stats svg {
	 margin-right: 5px;
}
 .task__owner {
	 width: 25px;
	 height: 25px;
	 border-radius: 100rem;
	 background: var(--purple);
	 position: absolute;
	 display: inline-block;
	 right: 0;
	 bottom: 0;
}
 .task-hover {
	 border: 3px dashed var(--light-grey) !important;
}
 .task-details {
	 width: 24%;
	 border-left: 1px solid #d9e0e9;
	 display: inline-block;
	 height: 100%;
	 vertical-align: top;
	 padding: 3rem 2rem;
}
 .tag-progress {
	 margin: 1.5rem 0;
}
 .tag-progress h2 {
	 font-size: 16px;
	 margin-bottom: 1rem;
}
 .tag-progress p {
	 display: flex;
	 width: 100%;
	 justify-content: space-between;
}
 .tag-progress p span {
	 color: #b4b4b4;
}
 .tag-progress .progress {
	 width: 100%;
	 -webkit-appearance: none;
	 appearance: none;
	 border: none;
	 border-radius: 10px;
	 height: 10px;
}
 .tag-progress .progress::-webkit-progress-bar, .tag-progress .progress::-webkit-progress-value {
	 border-radius: 10px;
}
 .tag-progress .progress--copyright::-webkit-progress-bar {
	 background-color: #ecd8e6;
}
 .tag-progress .progress--copyright::-webkit-progress-value {
	 background: #d459e8;
}
 .tag-progress .progress--illustration::-webkit-progress-bar {
	 background-color: #dee7e3;
}
 .tag-progress .progress--illustration::-webkit-progress-value {
	 background-color: #46bd84;
}
 .tag-progress .progress--design::-webkit-progress-bar {
	 background-color: #d8e7f4;
}
 .tag-progress .progress--design::-webkit-progress-value {
	 background-color: #08a0f7;
}
 .task-activity h2 {
	 font-size: 16px;
	 margin-bottom: 1rem;
}
 .task-activity li {
	 list-style: none;
	 margin: 1rem 0;
	 padding: 0rem 1rem 1rem 3rem;
	 position: relative;
}
 .task-activity time {
	 display: block;
	 color: var(--light-grey);
}
 .task-icon {
	 width: 30px;
	 height: 30px;
	 border-radius: 100rem;
	 position: absolute;
	 top: 0;
	 left: 0;
	 display: flex;
	 align-items: center;
	 justify-content: center;
}
 .task-icon svg {
	 font-size: 12px;
	 color: var(--white);
}
 .task-icon--attachment {
	 background-color: #fba63c;
}
 .task-icon--comment {
	 background-color: #5dc983;
}
 .task-icon--edit {
	 background-color: #7784ee;
}


</style>