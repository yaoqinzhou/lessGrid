/**
 * lessGrid.js v1.0.0
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2014
 */
// 创建一个闭包  
	(function($) {  
	    // 插件的定义  
	    $.fn.lessGrid = function(options) {  
	        var $this = $(this);
	        
	        options = $.extend({},$.lessGrid.defaults,options);
	        
		    var tabId = options.id;
		    
            Object.defineProperty($.lessGrid.options,tabId,{value:options});   //为对象添加属性

            $this.append(options.tabName);
            
			var targetTab = initEmptyTab($this,options.id);
			targetTab = $.lessGrid.initTabTh(targetTab,options);
			
			$this.append(targetTab);  //加入表格
			
			if($.lessGrid.options[tabId].pagination){  //是否加入分页
			    $this.append($.lessGrid.initPageLabel(options.id));  //初始化翻页标签
			}

			$.lessGrid.doInitTabData(targetTab,options);

			if($.lessGrid.options[tabId].showLoading){
				$this.append($.lessGrid.initMaskDiv(tabId,$.lessGrid.options[tabId].loadingMsg));
			}
			

			return $this;
	    };  
	    
		//初始化一个空的表
		function initEmptyTab($obj,tabId){
			var tabObj = "<table class='lessGridTable'></table>";
			
			return $(tabObj).attr("id",tabId);
		}

	// 闭包结束  
	})(jQuery);   
	
	jQuery.lessGrid = {
		defaults:{
			pageSize:10,
			pageNo:1,
			pagination:false,
			loadingMsg:"数据正在加载中...",
			showLoading:false,
			tabName:""
		},
		options:{
			
		},
		initMaskDiv:function(tabId,loadMsg){   //初始化弹出层
			var maskDivStr = "<div><center>"+loadMsg+"</center></div>";
			var targetMaskDiv = $(maskDivStr).attr("id",tabId+"_maskDiv");
			
			targetMaskDiv.css("display","none");
			targetMaskDiv.css("position","fixed");
			targetMaskDiv.css("top","0");
			targetMaskDiv.css("left","0");
			targetMaskDiv.css("z-index","999");
			targetMaskDiv.css("background-color","#101010");
			targetMaskDiv.css("filter","Alpha(opacity=30)");
			targetMaskDiv.css("opacity",".5");
			targetMaskDiv.css("color","red");
			targetMaskDiv.css("font-size","20px");
			
			return targetMaskDiv;
		},
		initTabTh:function (targetTab,options){   //初始化表头
			targetTab.empty();
			
			var tabTh = options.th;  //表头
			
			var thStr = "<tr>";
			$.each(tabTh,function (i,thObj){
			    thStr += "<th>" + thObj + "</th>";
			});
			
			thStr += "</tr>";
		
			return targetTab.append(thStr);
		},
	    doInitTabByPage:function (tabId,pageFlag){  //翻页事件
            var targetTab = $("#"+tabId);	    	
	    	var centerLabel = targetTab.next();
	    	
	    	var currTotalPageNo = centerLabel.children(":nth-child(1)").text();
	    	var currPageNo =  centerLabel.children(":nth-child(2)").text();

		    if(pageFlag == "nextPage"){
	      		  currPageNo = parseInt(currPageNo) + 1;
	      	}else if(pageFlag == "prePage"){
	      		  currPageNo = parseInt(currPageNo) - 1;
	      	}else if(pageFlag == "lastPage"){
	      		  currPageNo = currTotalPageNo;
	      	}else if(pageFlag == "firstPage"){
	      		  currPageNo = 1;
	      	}
		    
			$.lessGrid.refreshTab(tabId,targetTab,currPageNo);
		    
	    },
	    refreshTab:function(tabId,targetTab,currPageNo){
	    	 $.lessGrid.options[tabId].pageNo = currPageNo;
			    
			 $.lessGrid.doInitTabData(targetTab,$.lessGrid.options[tabId]);  //从后台取数据插入表格
	    },
	    doInitTabData:function (targetTab,options){
	    	$.lessGrid.doMaskDiv(options,"inline");
	    	
	    	var trStr = "";
	    	
			 $.ajax({
					url:options.url,
					contentType:'application/json',
					data:{pageNum:options.pageNo,pageSize:options.pageSize},
					type:'GET',               
					dataType:'json',            
					success:function (data){  
						data = eval('(' + data + ')'); 

						var trJsonInfo = data.downloadMapList;  //后台返回的行数据
						var totalPageNo = data.totalPageNo;  //后台返回的总共页数

						
						$.each(trJsonInfo,function (i,trObj){
							trStr += "<tr>";
							
							$.each(options.colName,function(i,colName){
				
								trStr += "<td><span class='textover'>" + trObj[colName] + "</span></td>";
							});
				
							trStr += "</tr>";
		            	});
						
						$.lessGrid.initTabTh(targetTab,options);  //清空表格和初始化表头
						
						targetTab.append(trStr);

						if(options.pagination){
							$.lessGrid.doInitPage(targetTab,options.pageNo,totalPageNo);  //初始化翻页数据
						}
						
				    	$.lessGrid.doMaskDiv(options,"none");

					},
					error:function (data){      
						alert("Error!");
					}
			 });
	    	
	    },
	    doMaskDiv:function(options,displayFlag){
	    	if(options.showLoading){
	    		var tabId = options.id;
		    	var targetTab = $("#"+tabId);
		    	
	            var targetMaskDiv = $("#"+tabId+"_maskDiv");
	            
		    	if(displayFlag == "inline"){
		    		var targetWidth = targetTab.css("width");
			    	var targetHeight = targetTab.css("height");
			    	
			    	var centerHeight = targetTab.next().css("height");
			    	
			    	var totalHeight = parseInt(targetHeight)+parseInt(centerHeight);
			    	
			    	var targinMargin = targetTab.parent().css("margin");
			    	
			    	targetMaskDiv.css("width",targetWidth);
			        targetMaskDiv.css("height",totalHeight + "px");
			        targetMaskDiv.css("margin",targinMargin);

			        var targetMskMsg = targetMaskDiv.children(":first");
			        targetMskMsg.css("padding-top",(totalHeight / 2) + "px");  //遮盖层中的文字居中显示
		    	}

	            targetMaskDiv.css("display",displayFlag);
	    	}
	    },
	    initPageLabel:function(tabId){   //初始化翻页标签
	    	var pageObj = "";

			pageObj += "<center>";
			pageObj += "共 <span></span> 页  第 <span></span> 页";
			pageObj += "<span><a href=javascript:$.lessGrid.doInitTabByPage('"+tabId+"','firstPage')>第一页</a></span> ";
			pageObj += "<span><a href=javascript:$.lessGrid.doInitTabByPage('"+tabId+"','prePage')>上一页</a></span>";
			pageObj += "<span><a href=javascript:$.lessGrid.doInitTabByPage('"+tabId+"','nextPage')>下一页</a></span>";
			pageObj += "<span><a href=javascript:$.lessGrid.doInitTabByPage('"+tabId+"','lastPage')>最后一页</a></span>";
			pageObj += "第<input style='width:30px;' type='text' onkeydown=if(event.keyCode==13){$.lessGrid.gotoPage('"+tabId+"',this);}>页 ";
			pageObj += "</center>";			
			
	
			return pageObj;
	    	
	    },
	    doInitPage:function (targetTab,currPageNo,totalPageNo){  //初始化翻页数据,参数为当前表格对象、当前页数、总页数
	    	var firstChild =  targetTab.next().children(":first");
        	var secondChild = firstChild.next();
        	  
        	firstChild.text(totalPageNo);  //初始化总共的页数
        	secondChild.text(currPageNo);    //初始化当前页数

        	if(currPageNo == totalPageNo){  //当前页数等于总页数，则隐藏下一页标签和最后一页标签
        		$.lessGrid.disabledPageLabel(targetTab,"nextPage");
        		$.lessGrid.disabledPageLabel(targetTab,"lastPage");	
        		
        		$.lessGrid.enabledPageLabel(targetTab,"prePage");	
           		$.lessGrid.enabledPageLabel(targetTab,"firstPage");	       		
        	}else{
        		$.lessGrid.enabledPageLabel(targetTab,"nextPage");	
           		$.lessGrid.enabledPageLabel(targetTab,"lastPage");	     
           		
           		$.lessGrid.enabledPageLabel(targetTab,"prePage");	
           		$.lessGrid.enabledPageLabel(targetTab,"firstPage");	     
        	}
        	
        	if(currPageNo == 1){   //当前页是第一页,则隐藏第一页和上一页
        		$.lessGrid.disabledPageLabel(targetTab,"prePage");
        		$.lessGrid.disabledPageLabel(targetTab,"firstPage");	
        	}
        	
		},
		disabledPageLabel:function(targetTab,labelFlag){
			var targetLabel = $.lessGrid.getPageLabel(targetTab,labelFlag);
			
		  	targetLabel.css("color","#ccc");
        	targetLabel.css("cursor","default");
        	targetLabel.attr("href","#");
		},
		enabledPageLabel:function(targetTab,labelFlag){
			var targetLabel = $.lessGrid.getPageLabel(targetTab,labelFlag);
    	  
			var tabId = $(targetTab).attr("id");
    	    var hrefStr = "";
    	  
	    	hrefStr = "javascript:$.lessGrid.doInitTabByPage('"+tabId+"','"+labelFlag+"')";
	
	    	targetLabel.css("color","#0000ee");
	    	targetLabel.css("cursor","auto");
	    	targetLabel.attr("href",hrefStr);
		},
		getPageLabel:function(targetTab,labelFlag){
	   	  	var labelIndex = 0;
	   	  
	   	  	if(labelFlag == "nextPage"){
	   		   labelIndex = 5;
	   	    }else if(labelFlag == "prePage"){
	   		   labelIndex = 4;
	   	    }else if(labelFlag == "firstPage"){
	   		   labelIndex = 3;
	   	    }else if(labelFlag == "lastPage"){
	   		   labelIndex = 6;
	   	    }
	   	  
	   	    var targetLabel = targetTab.next().children(":nth-child("+labelIndex+")").children(":first");
	   	  
	   	    return targetLabel;
		},
		gotoPage:function(tabId,gotoObj){
			var gotoPageNo = $(gotoObj).val();
			
			var r = /^\+?[1-9][0-9]*$/;

       	    if(r.test(gotoPageNo)){       	    	
       	    	var currTotalNum = $(gotoObj).parent().children(":first").text();
       	    	
       	        if(parseInt(gotoPageNo) > parseInt(currTotalNum)){
   			    	alert("请输入合法的页数！");
	   		    }else{
	   		    	var targetTab = $("#"+tabId);
	   		    	
	   		 	    $.lessGrid.refreshTab(tabId,targetTab,gotoPageNo);
	   		    }
     
       	    	
       	    }else{
       	        alert("请输入合法的页数！");
       	    }
		}
			
	}