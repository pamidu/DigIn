            routerApp.directive('accordion', [function () {
                    return {
                        restrict: 'E',
                        replace:true,
                        transclude:true,
                        scope:{

                        },
                        controller:function($scope,$element){
                            var activePanel=null;
                            
                            this.openPanel=function(panel){
                                if(this.activePanel!=null){
                                    if(panel.active){
                                        console.log("accordion if if");
                                        this.activePanel.active=false;
                                        this.activePanel=null;
                                        panel.icon='bower_components/material-design-icons/navigation/svg/production/ic_expand_more_18px.svg';
                                    }else{
                                        console.log("accordion if else");
                                        this.activePanel.active=false;
                                        this.activePanel.icon='bower_components/material-design-icons/navigation/svg/production/ic_expand_more_18px.svg';
                                        this.activePanel=panel;
                                        this.activePanel.active=true;
                                        panel.icon='bower_components/material-design-icons/navigation/svg/production/ic_expand_less_18px.svg';  
                                    }
                                }else{
                                    console.log("accordion else");

                                    this.activePanel=panel;
                                    this.activePanel.active=true;
                                    panel.icon='bower_components/material-design-icons/navigation/svg/production/ic_expand_less_18px.svg';
                                }
                            }

                        },
                        template:'<div class="accordion" ng-transclude></div>',
                        link: function (scope, element, attrs) {
                        }
                    };
                }])
            
            routerApp.directive('accordionPanel', [function () {
                //console.log('acc test:'+closeFunc);
                    return {
                        require: '^accordion',
                        restrict: 'E',
                        transclude:true,
                        replace:true,
                        scope:{
                            title:'@',
                            itemind:'@',
                            someCtrlFn: '&callbackFn'
                        },
                        template:'<section class="accordion-panel">'+
                                    '<div layout="row"><md-button flex ng-click="toggle();">'+
                                    '<div flex="" layout="row">'+
                                    '<span class="accordion-panel-title">{{title}}</span>'+
                                    '<span flex=""></span>'+
                                    '<span layout-align="row"><md-icon md-svg-src="{{icon}}"></md-icon></span></div>'+
                                    '</md-button><md-button flex="" ng-if="itemind >= 0" ng-click="someCtrlFn(itemind);"><md-icon class="ion-close"></md-icon></md-button></div>'+
                                    '<md-content class="animate-show" ng-show="active" ng-transclude layout-margin layout-align="center center" layout="column"></md-content>'+
                                '</section>',
                        link: function (scope, element, attrs, accordionCtrl) {
                            var clickCount = 0;
                            var elem=element[0];
                            elem.id='panel_'+scope.$id;
                            
                            scope.childNodes=document.querySelector("#"+elem.id+" md-content").children.length;

                            scope.icon='bower_components/material-design-icons/navigation/svg/production/ic_expand_more_18px.svg';
                            scope.active=false;
                            scope.title=scope.title;
                            scope.itemind = scope.itemind;

                            scope.toggle=function(){
                                accordionCtrl.openPanel(scope);
                            }
                        }
                    };
                }])
            