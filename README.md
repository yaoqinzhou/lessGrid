# lessGrid
a simple tableGrid

##How to use

###example

1、import css & js file

  import lessGrid.css && jquery.lessGrid-0.0.1.min.js


2、html code

 <div id='boardDiv' style='margin-top:0px;'></div>

3、page onload

$(document).ready(function(){
	 var options = {
	 
			id:'boardTab',
			
			th:['titelName'],
			
			colName:['content'], 
			
			url:urlPath,
			
			pageNo:1,
			
			pageSize:20,
			
			pagination:true
			
		};
	  
	  $("#boardDiv").lessGrid(options);

});	

4、Data format

{"downloadMapList":[{},{}],"totalPageNo":20}

downloadMapList is row data,  totalPageNo is totalPageNum

##Lience

**MIT**

	
	


