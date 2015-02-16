# lessGrid
a simple tableGrid

How to use

example

1、import css & js file

<link rel="stylesheet" href="../StaticResource/css/lessGrid.css" type="text/css" />	
<script type="text/javascript" src="../StaticResource/js/jquery.lessGrid-0.0.1.min.js"></script>

2、html code

<div id="boardDiv" style="margin-top:0px;"></div>

3、page onload
    $(document).ready(function(){
		 var options = {
				id:'boardTab',
				th:['titelName'],
				colName:['content'], 
				url:"<%=request.getContextPath()%>/manage/lessGridNoticeInfo.do",
				pageNo:1,
				pageSize:20,
				pagination:true
			};
		  
		  $("#boardDiv").lessGrid(options);
	
	});	

	
	


