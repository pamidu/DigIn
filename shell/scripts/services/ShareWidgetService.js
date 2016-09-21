routerApp.service('ShareWidgetService',function(Upload,$http,Digin_Engine_API,Digin_Domain){

      

      this.getShareWidgetURL = function(widget,callback,provider){

        var svgTag = "";
        var date = new Date().getTime();
        var fileNamepng= widget.widgetName + date +".png";
        var fileName = widget.widgetName + date +".svg";
        if(widget.widgetName=="highcharts" || widget.widgetName=="histogram"  || widget.widgetName=="forecast"){

          var elementId = widget.widgetID;
          var ele = document.getElementsByClassName(elementId)[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
           
          var clone = $(ele).clone();
          var cloneSvg = clone[0];
          var a = cloneSvg.getElementsByClassName("highcharts-button");
          $(cloneSvg).find(a).remove();
           
          svgTag ='<svg viewBox="0 0 500 600" width="100%" height="100%">'+cloneSvg.innerHTML+ '</svg>';
          var file = new File([svgTag], fileName, {type: "image/svg+xml"});

        }
        else if(widget.widgetName=="hierarchy" || widget.widgetName=="sunburst"){
          var id = "#" + widget.widgetData.widData.id;
          var element = $("" + id + "");
          
          var svgTag =element[0].children[0].innerHTML;
          svgTag ='<svg viewBox="0 0 500 600" width="100%" height="100%">'+svgTag+ '</svg>';

          var file = new File([svgTag], fileName, {type: "image/svg+xml"});
           

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

//http://staging.digin.io/digin_data/digin_user_data/b53bd4afc6a56b2d32ab26fc25ec60c2/omalduosoftwarecom.prod.digin.io/shared_files/highcharts1473758675719.png

            var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
            var res = userInfo.Username.replace("@", "");
            var NameSpace = res.replace(".", "");
            var tenent = NameSpace + "." + Digin_Domain;
            //var url = "http://" + Digin_Domain + data.Result + "/digin_user_data/" + userInfo.UserID + "/" + userInfo.Username + "/shared_files/" +fileName;
            var url = "http://" + Digin_Domain + data.Result + "/digin_user_data/" + userInfo.UserID + "/" + tenent + "/shared_files/" +fileNamepng;
            
            callback(url,provider);

        }).error(function (data) {
           
        });
      }

});