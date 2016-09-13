routerApp.service('ShareWidgetService',function(Upload,$http,Digin_Engine_API,Digin_Domain){

      

      this.getShareWidgetURL = function(widget,callback,provider){

        var svgTag = "";
        var fileName = widget.widgetName + new Date().getTime()+".svg";
        if(widget.widgetName=="highcharts" || widget.widgetName=="histogram"){

          var elementId = widget.widgetID;
          var svgTag =document.getElementsByClassName(elementId)[0].childNodes[0].childNodes[1].childNodes[0].innerHTML;
          var file = new File([svgTag], fileName, {type: "image/svg+xml"});

        }
        else if(widget.widgetName=="hierarchy"){
          var id = "#" + widget.widgetData.widData.id;
          var element = $("" + id + "");
          var svgTag =element[0].innerHTML;
          var file = new File([svgTag], fileName, {type: "image/svg+xml"});
           

        }
         var userInfo= JSON.parse(decodeURIComponent(getCookie('authData')));
           Upload.upload({
            url: 'http://staging.digin.io:1929/' + 'file_upload',
            headers: {'Content-Type': 'multipart/form-data',},
            data: {
                db: 'BigQuery',
                SecurityToken: '0285096850fee688b6704a83c9ea1223',
                other_data:'widget_image',
                file: file
            }
        }).success(function (data) {

//http://staging.digin.io/digin_data/digin_user_data/b53bd4afc6a56b2d32ab26fc25ec60c2/omalduosoftwarecom.prod.digin.io/shared_files/highcharts1473758675719.png

            var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
            var res = userInfo.Username.replace("@", "");
            var NameSpace = res.replace(".", "");
            var tenent = NameSpace + "." + Digin_Domain;
            //var url = "http://" + Digin_Domain + data.Result + "/digin_user_data/" + userInfo.UserID + "/" + userInfo.Username + "/shared_files/" +fileName;
            var url = "http://staging.digin.io"  + data.Result + "/digin_user_data/" + userInfo.UserID + "/" + tenent + "/shared_files/" +fileName;
            
            callback(url,provider);

        }).error(function (data) {
           
        });
      }

});