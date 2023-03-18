

<template>
  <div class='task' draggable='true'>
		<p><u>Task</u></p>
      	<p>{{Task}}</p>
		<br>
		<p><u>Description</u></p>
      	<p>{{Description}}</p>
		<br>
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
	 font-size: 15px;
	 font-weight: bold;
}
#date-box {
	border: 1px solid;
	border-radius: 5px;
	border-color: lightgrey;
	width: 75%;
	text-align: center
}


</style>