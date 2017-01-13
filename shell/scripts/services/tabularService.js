routerApp.service('tabularService',function($rootScope,$http,Digin_Engine_API,Digin_Domain){



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

            widData.userList = widData.pageingArr[widData.currentPage].pageEle;
            widData.selectedPage = widData.pageingArr[widData.currentPage].pageLable;


	}

	this.tabularNavigate =function (direction,widget){


        if(direction == "Next" && widget.widgetData.widData.currentPage+1 < widget.widgetData.widData.pageingArr.length){
            widget.widgetData.widData.currentPage++;
            widget.widgetData.widData.userList = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageEle;
            widget.widgetData.widData.selectedPage = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageLable;
        }
        if(direction == "Prev" && widget.widgetData.widData.currentPage > 0){
            widget.widgetData.widData.currentPage--;
            widget.widgetData.widData.userList = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageEle;
            widget.widgetData.widData.selectedPage = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageLable;

        }

    }


});