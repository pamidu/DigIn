DiginApp.service('widgetShareService',function(Upload,$rootScope,$http,Digin_Engine_API,Digin_Domain,notifications){ 
      this.getShareWidgetURL=function(widget,callback,provider){
            var svgTag = "";
            var date = new Date().getTime();
            var widType =  widget.widgetData.chartType.chartType;
            var fileNamepng= widType + date +".png";
            var fileName = widType + date +".svg";
            var widgetName = "";

            if(typeof widget.widgetName != "undefined"){
              if(widget.widgetData.widName != "")
                widgetName = widget.widgetName;
            }

            if(widType=="highCharts" || widType=="histogram"  || widType=="forecast" || widType=="boxplot" || widType=="metric"){

              var highchartsObj = angular.copy(widget.widgetData.widgetConfig);
              if ( highchartsObj.title !== undefined) {
                highchartsObj.title.text = widgetName;
              }

              var chart = angular.copy(highchartsObj.getHighcharts());
              if ( highchartsObj.title !== undefined ) {
                chart.setTitle({
                  text: widgetName
                });
              }          

              svg = chart.getSVG();
              var file = new File([svg], fileName, {type: "image/svg+xml"});
            }
            /*else if(widType=="hierarchy" || widType=="sunburst"){
              var id = "#" + widget.widgetData.widData.id;
              var element = $("" + id + "");
              var svgTag = element[0].children[0];

              //--------------------------------------------------------------------------------------
               if(widgetName != ""){
                  var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                  newElement.setAttribute('x',200);
                  newElement.setAttribute('y',550);
                  newElement.setAttribute('fill','#000000');
                  newElement.setAttribute('font-size',17);
                  newElement.setAttribute('font-family','Verdana');

                  newElement.innerHTML = widgetName;
                  svgTag.appendChild(newElement);
                }
              //--------------------------------------------------------------------------------------

              var svgTag =element[0].children[0].innerHTML;
              svgTag ='<svg viewBox="0 0 500 600" width="100%" height="100%">'+svgTag+ '</svg>';
              var file = new File([svgTag], fileName, {type: "image/svg+xml"});
               

            }*/else if(widType=="bubble"){
               var highchartsObj = angular.copy(widget.widgetData.widgetConfig);
               highchartsObj.title.text = widgetName;
               var chart = angular.copy(highchartsObj.getHighcharts());
                chart.setTitle({
                  text: widgetName
                })
               svg = chart.getSVG();
               var file = new File([svg], fileName, {type: "image/svg+xml"});
            }

            var userInfo= JSON.parse(decodeURIComponent(getCookie('authData')));
                Upload.upload({
                url: Digin_Engine_API + 'file_upload',
                headers: {'Content-Type': 'multipart/form-data',},
                data: {
                    db: 'BigQuery',
                    SecurityToken: userInfo.SecurityToken,
                    other_data:'widget_image',
                    file: file
                }
            }).success(function (data) {
                if(data.Is_Success == true){
                    var tenent = window.location.hostname;
                    //var url = "http://" + Digin_Domain + data.Result + "/digin_user_data/" + userInfo.UserID + "/" + userInfo.Username + "/shared_files/" +fileName;
                    var url = "http://" + Digin_Domain + data.Result + "/digin_user_data/" + userInfo.UserID + "/" + tenent + "/shared_files/" +fileNamepng;
                    callback(url,provider);
                }else{
                  notifications.toast(0, data.Custom_Message);
                }
            }).error(function (data) {
               
            });
        }

});