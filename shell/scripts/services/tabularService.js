routerApp.service('tabularService',function($rootScope,$http,Digin_Engine_API,Digin_Domain,$diginengine,$diginurls){


    var thisService = this;
	this.setPagination = function(summaryData,widData){

			widData.userList.length =0;
			widData.pageingArr.length=0;
            var pageCount = summaryData.length/widData.tabularConfig.numOfRows;

            
            var numOfRows = parseInt(widData.tabularConfig.numOfRows);
            var uperBound = parseInt(widData.tabularConfig.numOfRows);
            var lowerBound = 0;

            for(var i = 0; i < Math.ceil(pageCount) ; i++){

                var pageEle = summaryData.slice(lowerBound,uperBound);

                var obj = {
                    "pageNum" : i,
                    "pageEle" : pageEle,
                    "pageLable" : lowerBound+1 +"-"+uperBound
                }

                widData.pageingArr.push(obj);
                uperBound = uperBound+numOfRows;
                lowerBound = lowerBound+ numOfRows;


            }

            widData.userList = widData.pageingArr[0].pageEle;
            widData.selectedPage = widData.pageingArr[0].pageLable;
            widData.currentPage=0;


	}

	this.tabularNavigate =function (direction,widget,init){

        if(init == false){
            if(direction == "Next" && widget.widgetData.widData.currentPage+1 < widget.widgetData.widData.pageingArr.length){
                widget.widgetData.widData.currentPage++;
                widget.widgetData.widData.userList = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageEle;
                widget.widgetData.widData.selectedPage = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageLable;
            }else if(direction == "Next" && widget.widgetData.widData.currentPage+1 >= widget.widgetData.widData.pageingArr.length){
                thisService.getNextDataSet(widget);
            }

            if(direction == "Prev" && widget.widgetData.widData.currentPage > 0){
                widget.widgetData.widData.currentPage--;
                widget.widgetData.widData.userList = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageEle;
                widget.widgetData.widData.selectedPage = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageLable;
            }
        }
        else{
            widget.widgetData.widData.currentPage =0;
            widget.widgetData.widData.userList = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageEle;
            widget.widgetData.widData.selectedPage = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageLable;
        }
      

    }


    this.getNextDataSet = function(widget){

        var cl = $diginengine.getClient(widget.widgetData.commonSrc.src.src);
        var offset = widget.widgetData.widData.pageingArr.length * widget.widgetData.widData.tabularConfig.numOfRows;

        cl.getExecQuery(widget.widgetData.widData.query, widget.widgetData.commonSrc.src.id, function(data, status) {
            if(status){

                var pageCount = parseInt(widget.widgetData.widData.pageingArr.length) + data.length/widget.widgetData.widData.tabularConfig.numOfRows;

                var numOfRows = parseInt(widget.widgetData.widData.tabularConfig.numOfRows);
                var uperBound = parseInt(widget.widgetData.widData.tabularConfig.numOfRows);
                var lowerBound = 0;

                for(var i = widget.widgetData.widData.pageingArr.length; i < Math.ceil(pageCount) ; i++){

                    var pageEle = data.slice(lowerBound,uperBound);

                    var down = ((widget.widgetData.widData.pageingArr.length)*parseInt(widget.widgetData.widData.tabularConfig.numOfRows))+1 ;
                    var up = ( parseInt(widget.widgetData.widData.pageingArr.length)*parseInt(widget.widgetData.widData.tabularConfig.numOfRows))+parseInt(widget.widgetData.widData.tabularConfig.numOfRows);
                    var obj = {
                        "pageNum" : i,
                        "pageEle" : pageEle,
                        "pageLable" : down +"-"+ up
                    }

                    widget.widgetData.widData.pageingArr.push(obj);
                    uperBound = uperBound+numOfRows;
                    lowerBound = lowerBound+ numOfRows;

                }

                widget.widgetData.widData.currentPage++;
                widget.widgetData.widData.userList = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageEle;
                widget.widgetData.widData.selectedPage = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageLable;

            }
        },100,offset);
    }

    this.getExecQueryFilterArr = function(widget,filterStr){


        var fieldArray = [];
        var FilterQuery = "";

        if(widget.widgetData.commonSrc.src.src == "BigQuery"){
            for(var i=0; i < widget.widgetData.widData.tabularConfig.AllingArr.length; i++){

                fieldArray.push(widget.widgetData.widData.tabularConfig.AllingArr[i].Attribute);
            }

        
            FilterQuery = "SELECT " + fieldArray.toString() + " FROM " + $diginurls.getNamespace() + "." + widget.widgetData.commonSrc.src.tbl + " WHERE "+ filterStr +" ORDER BY "+widget.widgetData.widData.tabularConfig.defSortFeild+" "+widget.widgetData.widData.tabularConfig.AscOrDec;

        }
        else{
            for(var i=0; i < widget.widgetData.widData.tabularConfig.AllingArr.length; i++){

                fieldArray.push('['+widget.widgetData.widData.tabularConfig.AllingArr[i].Attribute+']');
            }

            var defSortFeild='['+$scope.widget.widgetData.widData.tabularConfig.defSortFeild+']';
            FilterQuery = "SELECT " + fieldArray.toString() + " FROM " +"["+ widget.widgetData.commonSrc.src.tbl.split(".")[0]+ "].["+widget.widgetData.commonSrc.src.tbl.split(".")[1] +"]" + " WHERE " + filterStr + " ORDER BY "+widget.widgetData.widData.tabularConfig.defSortFeild+" "+widget.widgetData.widData.tabularConfig.AscOrDec;
        }

       return FilterQuery;
    }


});


