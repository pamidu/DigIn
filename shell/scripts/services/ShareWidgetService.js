routerApp.service('ShareWidgetService',function(){

      

      this.getShareWidgetURL = function(widget){

        var svgTag = "";
        if(widget.widgetName=="highcharts" || widget.widgetName=="histogram"){

          var elementId = widget.widgetID;
          var svgTag =document.getElementsByClassName(elementId)[0].childNodes[0].childNodes[1].childNodes[0].innerHTML;
        }
        else if(widget.widgetName=="hierarchy"){
          var id = "#" + widget.widgetData.widData.id;
          var element = $("" + id + "");
          var svgTag =element[0].innerHTML;
        }





        //return this.getURL(svgTag);
        return "http://720kb.net";
      }


      this.getURL = function(svg){

      }

});