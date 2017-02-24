/*!
* angular-toastino v0.0.8
* https://github.com/Mexassi/angular-toastino
* Copyright (c) 2015 Massimo Presta
* License: MIT
*/

'use strict';

var directiveLibraryModule = angular.module('directivelibrary',[]);

/*
          __                 __            _____                           .__                                                      
  _______/  |______ ________/  |_    _____/ ____\   ____    ____           |__| _____    ____             ___________  ____ ______  
 /  ___/\   __\__  \\_  __ \   __\  /  _ \   __\   /    \  / ___\   ______ |  |/     \  / ___\   ______ _/ ___\_  __ \/  _ \\____ \ 
 \___ \  |  |  / __ \|  | \/|  |   (  <_> )  |    |   |  \/ /_/  > /_____/ |  |  Y Y  \/ /_/  > /_____/ \  \___|  | \(  <_> )  |_> >
/____  > |__| (____  /__|   |__|    \____/|__|    |___|  /\___  /          |__|__|_|  /\___  /           \___  >__|   \____/|   __/ 
     \/            \/                                  \//_____/                    \//_____/                \/             |__|    
*/

directiveLibraryModule.factory('Toastino',['$timeout', function ($timeout) {
  var Toastino = function (classValue) {
    this.message = '';
    this.classValue = classValue;
    this.position = 'ts-top-right';
    this.className = 'ts-toastino';
    this.autoDismiss = false;
    this.delay = 3700;
    this.observer = null;
    this.array = undefined;
  };

  Toastino.prototype.registerListener = function (listener) {
    this.observer = listener;
  };

  Toastino.prototype.broadcastChanges = function () {
    if (this.observer.update instanceof Function) {
      this.observer.update(this);
    }
  };

  Toastino.prototype.manualDismiss = function () {
    this.autoDismiss = false;
  };

  Toastino.prototype.setClass = function () {
    this.className += (this.position !== undefined && this.position !== null) ? ' ' + this.classValue + ' ' + this.position : this.classValue;
  };

  Toastino.prototype.setMessage = function (message) {
    this.setClass();
    this.message = message;
    this.close();
  };

  Toastino.prototype.close = function () {
    if (this.autoDismiss) {
      var self = this;
      $timeout(function () {
        self.dismiss();
      }, this.delay);
    }
  };

  Toastino.prototype.clearMessage = function () {
    this.message = '';
  };

  Toastino.prototype.dismiss = function () {
    this.className += ' ' + Toastino.DISMISS;
    var self = this;
    //remove item from array after dismiss css animation ends -> 350ms
    $timeout(function () {
      self.broadcastChanges(this);
    }, 350);
  };

  Toastino.DISMISS = 'ts-dismiss';

  return Toastino;
}]);

directiveLibraryModule.factory('notifications',['Toastino', '$mdDialog', function(Toastino, $mdDialog) {

  var ToastinoService = function () {
    this.toastinoMessages = [];
    this.observer = undefined;
    this.config = {
      containerClass: 'ts-container'
    }
  };

  /*ToastinoService.prototype.TOAST_CLASS_DANGER = 'alert alert-danger';
  ToastinoService.prototype.TOAST_CLASS_WARNING = 'alert alert-warning';
  ToastinoService.prototype.TOAST_CLASS_SUCCESS = 'alert alert-success';
  ToastinoService.prototype.TOAST_CLASS_INFO = 'alert alert-info';*/

  ToastinoService.prototype.registerListener = function(observer){
    this.observer = observer;
  };

  ToastinoService.prototype.broadcastChanges = function(){
    if(this.observer !== undefined && this.observer.toastChanged instanceof Function){
      //this.observer.toastChanged();
    } else {
      console.error('Cannot toast.');
    }
  };

  ToastinoService.prototype.update = function (toastino) {
    if (toastino instanceof Toastino) {
      this.remove(toastino, toastino.array);
    }
  };

  ToastinoService.prototype.remove = function(toastino, array) {
    var toastinos = (array !== undefined) ? array : this.toastinoMessages;
    for (var i = 0; i < toastinos.length; i++) {
      if (toastino === toastinos[i]) {
        toastinos.splice(i, 1);
        break;
      }
    }
  };

  ToastinoService.prototype.buildToastino = function (object) {
    var toastino = new Toastino(object.classValue);

    if (object.autoDismiss !== undefined) {
      toastino.autoDismiss = object.autoDismiss;
    }

    if (object.delay !== undefined) {
      toastino.delay = object.delay;
    }

    if (object.array !== undefined) {
      toastino.array = object.array;
    }

    toastino.registerListener(this);
    toastino.setMessage(object.message);
    return toastino;
  };

  ToastinoService.prototype.popToast = function(toastino){
    this.toastinoMessages.unshift(toastino);
  };
  
  ToastinoService.prototype.toast = function (type, message, length) {
		
		var classType = "";
		if(type == 0)
		{
			classType = "alert-danger";
		}else if(type == 1){
			classType = "alert-success";
		}else if(type == 2){
			classType = "alert-warning";
		}else{
			classType = "alert-info";
		}
    this.makeToast({
      classValue: classType,
      message: message,
      autoDismiss: true
    }, length);
  };

  ToastinoService.prototype.makeToast = function (object, length) {
    if (object.classValue !== undefined && object.message !== undefined) {

      object.delay = length ? (length === 'long' ? 7400 : 3700) : 3700;

      var toastino = this.buildToastino(object);
      this.popToast(toastino);
      this.broadcastChanges();
    } else {
      throw new TypeError('The object must have properties: classValue, message');
    }
  };
	
	ToastinoService.prototype.startLoading = function(displayText) {
		$mdDialog.show({
		  template: 
			'<md-dialog style="max-width:400px;">'+
			'	<md-dialog-content style="padding:20px;">'+
			'		<div layout="row" layout-align="start center">'+
			'			<md-progress-circular class="md-primary" md-theme="{{$root.theme}}" md-mode="indeterminate" md-diameter="40" style=" padding-right: 45px"></md-progress-circular>'+
			'			<span style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;">'+displayText+'</span>'+
			'		</div>'+
			'	</md-dialog-content>'+
			'</md-dialog>',
		  parent: angular.element(document.body),
		  clickOutsideToClose:false
		})
	}
	ToastinoService.prototype.finishLoading = function(){
		$mdDialog.hide();
	}

  return new ToastinoService();
}]);

directiveLibraryModule.factory('dialogService', ['$rootScope','$mdDialog', function($rootScope,$mdDialog){
	
		return {
			confirmDialog: function(ev,title, content, okText, cancelText) {
								
				var showData = {title: title, content: content, okText: okText, cancelText: cancelText }
				
				return $mdDialog.show({
						  controller: confirmDialogCtrl,
						  templateUrl: 'dialogs/confirm/confirmDialog.html',
						  parent: angular.element(document.body),
						  targetEvent: ev,
						  clickOutsideToClose:true,
						  locals: {showData: showData}
						})
						.then(function(answer) {
							return answer;
						});
			
			},alertDialog: function(title, content){
				$mdDialog.show(
				  $mdDialog.alert()
					.parent(angular.element(document.querySelector('input[name="editForm"]')))
					.clickOutsideToClose(true)
					.title(title)
					.textContent(content)
					.ariaLabel('Alert Dialog Demo')
					.ok('Got it!')
				);
			}
		}
	function confirmDialogCtrl ($scope, $mdDialog, showData) {
		$scope.showData = showData;
		$scope.confirmReply = function(answer) {
		  $mdDialog.hide(answer);
		};
	}
	
}])

directiveLibraryModule.directive('toastino', function () {
  return {
    restrict: 'E',
    scope: {
      containerclass: '@',
      toastinos: '='
    },
    template:
	'<md-toast class="md-top md-right">' +
		'<div class="md-toast-content fade-in-down alert-dismissible {{toast.className}}"  ng-repeat="toast in toastinoController.toastinos" layout="row" layout-align="space-between center">'+
			'<span flex>{{toast.message}}</span>'+
			 '<md-button  class="md-icon-button" style="margin-left: 20px !important;" ng-click="toast.dismiss()" aria-label="close"><i style="color:white;font-size:10px;" class="icon-cancel"></i></md-button>'+
		'</div>'+
	'</md-toast>',
    controller: function toastinoController(notifications, $scope) {
      var vm = this;
      vm.init = function(){
        if ($scope.toastinos) {
          vm.toastinos = $scope.toastinos;
        } else {
          vm.toastinos = [];
        }
        notifications.registerListener(vm);
        vm.toastChanged();
      };

      vm.toastChanged = function(){
        if (!$scope.toastinos) {
          vm.toastinos = notifications.toastinoMessages;

        } else {
        }
      };

      vm.init();
    },
    controllerAs:  'toastinoController'
  };
});

/*
                   .___         _____                           .__                                                      
  ____   ____    __| _/   _____/ ____\   ____    ____           |__| _____    ____             ___________  ____ ______  
_/ __ \ /    \  / __ |   /  _ \   __\   /    \  / ___\   ______ |  |/     \  / ___\   ______ _/ ___\_  __ \/  _ \\____ \ 
\  ___/|   |  \/ /_/ |  (  <_> )  |    |   |  \/ /_/  > /_____/ |  |  Y Y  \/ /_/  > /_____/ \  \___|  | \(  <_> )  |_> >
 \___  >___|  /\____ |   \____/|__|    |___|  /\___  /          |__|__|_|  /\___  /           \___  >__|   \____/|   __/ 
     \/     \/      \/                      \//_____/                    \//_____/                \/             |__|    
*/

/*
directiveLibraryModule.directive('plumbItem', function() {
	return {
	  restrict: 'A',       
	  link: function (scope, element, attrs) {
		//console.log("Add plumbing for the 'item' element");

		jsPlumb.makeTarget(element, {
		  endpoint:"Blank",
		  anchor:[ "Perimeter", { shape:"Square", anchorCount:8 }],
		  connectorOverlays:[ 
		  [ "Arrow", { width:30, length:30, location:1, id:"arrow" } ]
		  ]
		});
		jsPlumb.draggable(element, {            
		  containment: 'parent',
		  stop: function (evt, ui) {
			 var pos = $(this).offset();
			 scope.widget.top = element.position().top+'px';
			 scope.widget.left = element.position().left+'px';
			}
		});

	  }
	};
});*/
  
directiveLibraryModule.directive('errSrc', function () {
	return {
		link: function (scope, element, attrs) {
			element.bind('error', function () {
				if (attrs.src != attrs.errSrc) {
					attrs.$set('src', attrs.errSrc);
				}
			});

			attrs.$observe('ngSrc', function (value) {
				if (!value && attrs.errSrc) {
					attrs.$set('src', attrs.errSrc);
				}
			});
		}
	}
});

/*
     _             _            __                                             _ _____ _                        _   _    _____          _ _           _             
    | |           | |          / _|                                           | /  ___| |                      | | | |  |_   _|        | (_)         | |            
 ___| |_ __ _ _ __| |_    ___ | |_   _ __   __ _ ___ _____      _____  _ __ __| \ `--.| |_ _ __ ___ _ __   __ _| |_| |__  | | _ __   __| |_  ___ __ _| |_ ___  _ __ 
/ __| __/ _` | '__| __|  / _ \|  _| | '_ \ / _` / __/ __\ \ /\ / / _ \| '__/ _` |`--. \ __| '__/ _ \ '_ \ / _` | __| '_ \ | || '_ \ / _` | |/ __/ _` | __/ _ \| '__|
\__ \ || (_| | |  | |_  | (_) | |   | |_) | (_| \__ \__ \\ V  V / (_) | | | (_| /\__/ / |_| | |  __/ | | | (_| | |_| | | || || | | | (_| | | (_| (_| | || (_) | |   
|___/\__\__,_|_|   \__|  \___/|_|   | .__/ \__,_|___/___/ \_/\_/ \___/|_|  \__,_\____/ \__|_|  \___|_| |_|\__, |\__|_| |_\___/_| |_|\__,_|_|\___\__,_|\__\___/|_|   
                                    | |                                                                    __/ |                                                    
                                    |_|                                                                   |___/                                                    
*/									
directiveLibraryModule.directive('passwordStrengthIndicator',passwordStrengthIndicator);

function passwordStrengthIndicator() {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '='
        },
        link: function (scope, element, attrs, ngModel) {

        	scope.strengthText = "";

            var strength = {
                measureStrength: function (p) {
                    var _passedMatches = 0;
                    var _regex = /[$@&+#-/:-?{-~!^_`\[\]]/g;
                    if (/[a-z]+/.test(p)) {
                        _passedMatches++;
                    }
                    if (/[A-Z]+/.test(p)) {
                        _passedMatches++;
                    }
                    if (_regex.test(p)) {
                        _passedMatches++;
                    }
                    return _passedMatches;
                }
            };

            var indicator = element.children();
            var dots = Array.prototype.slice.call(indicator.children());
            var weakest = dots.slice(-1)[0];
            var weak = dots.slice(-2);
            var strong = dots.slice(-3);
            var strongest = dots.slice(-4);

            element.after(indicator);

            var listener = scope.$watch('ngModel', function (newValue) {
                angular.forEach(dots, function (el) {
                    el.style.backgroundColor = '#EDF0F3';
                });
                if (ngModel.$modelValue) {
                    var c = strength.measureStrength(ngModel.$modelValue);
                    if (ngModel.$modelValue.length > 7 && c > 2) {
                        angular.forEach(strongest, function (el) {
                            el.style.backgroundColor = '#039FD3';
                            scope.strengthText = "is very strong";
                        });
                   
                    } else if (ngModel.$modelValue.length > 5 && c > 1) {
                        angular.forEach(strong, function (el) {
                            el.style.backgroundColor = '#72B209';
                            scope.strengthText = "is strong";
                        });
                    } else if (ngModel.$modelValue.length > 3 && c > 0) {
                        angular.forEach(weak, function (el) {
                            el.style.backgroundColor = '#E09015';
                            scope.strengthText = "is weak";
                        });
                    } else {
                        weakest.style.backgroundColor = '#D81414';
                        scope.strengthText = "is very weak";
                    }
                }
            });

            scope.$on('$destroy', function () {
                return listener();
            });
        },
        template: '<span id="password-strength-indicator"><span></span><span></span><span></span><span></span><md-tooltip>password strength {{strengthText}}</md-tooltip></span>'
    };
}
/*
                _          __                                             _ _____ _                        _   _    _____          _ _           _             
               | |        / _|                                           | /  ___| |                      | | | |  |_   _|        | (_)         | |            
  ___ _ __   __| |   ___ | |_   _ __   __ _ ___ _____      _____  _ __ __| \ `--.| |_ _ __ ___ _ __   __ _| |_| |__  | | _ __   __| |_  ___ __ _| |_ ___  _ __ 
 / _ \ '_ \ / _` |  / _ \|  _| | '_ \ / _` / __/ __\ \ /\ / / _ \| '__/ _` |`--. \ __| '__/ _ \ '_ \ / _` | __| '_ \ | || '_ \ / _` | |/ __/ _` | __/ _ \| '__|
|  __/ | | | (_| | | (_) | |   | |_) | (_| \__ \__ \\ V  V / (_) | | | (_| /\__/ / |_| | |  __/ | | | (_| | |_| | | || || | | | (_| | | (_| (_| | || (_) | |   
 \___|_| |_|\__,_|  \___/|_|   | .__/ \__,_|___/___/ \_/\_/ \___/|_|  \__,_\____/ \__|_|  \___|_| |_|\__, |\__|_| |_\___/_| |_|\__,_|_|\___\__,_|\__\___/|_|   
                               | |                                                                    __/ |                                                    
                               |_|                                                                   |___/                                                     
*/

directiveLibraryModule.service('layoutManager',['$mdToast','$mdDialog', function($mdToast,$mdDialog){
	
	this.hideHeader = function() {
		console.log("hide header");
		$('.main-headbar-slide').animate({
			top: '-45px'
		}, 200);
		
		$('.dropdown').animate({
			top: '-45px'
		},200)
		
		$('.card-container').animate({
			paddingTop: '30px'
		},200)
		
		$('.setting-container').animate({
			paddingTop: '0px'
		},200)
		
		/*$('md-tabs-content-wrapper').animate({
			height: '100vh'
		},200)*/
		
		return false;
	}
	this.showHeader = function(){
		$('.main-headbar-slide').animate({
			top: '0px'
		}, 200);
		
		$('.dropdown').animate({
			top: '15px'
		},200)
		
		$('.card-container').animate({
			paddingTop: '70px'
		},200)
		
		$('.setting-container').animate({
			paddingTop: '45px'
		},200)
		
		var newHeight = $('md-tabs-content-wrapper').height(); - 45;
		
		$('md-tabs-content-wrapper').animate({
			height: newHeight
		},200)
		return true;
	}
	
	this.hideSideMenu = function(){
		$('.left-menu-slide').animate({
			left: '-45px'
		}, 200);
		$('.card-container').animate({
			paddingLeft: '0px'
		},200)
		$('.setting-container').animate({
			paddingLeft: '0px'
		},200);
		return false;
	}
	this.showSideMenu = function(){
		$('.left-menu-slide').animate({
			left: '0px'
		}, 200);
		$('.card-container').animate({
			paddingLeft: '45px'
		},200);
		$('.setting-container').animate({
			paddingLeft: '45px'
		},200);
		return true;
	}
}])

directiveLibraryModule.directive('myUpload', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            var reader = new FileReader();
            reader.onload = function (e) {
                scope.image = e.target.result;
                scope.$apply();
            }

            elem.on('change', function () {
                reader.readAsDataURL(elem[0].files[0]);
            });
        }
    };
}]);

directiveLibraryModule.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeFunc = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeFunc);
    }
  };
});

directiveLibraryModule.directive('countdownn', ['Util', '$interval', function(Util, $interval) {
	return {
		restrict: 'A',
		scope: {
			date: '@',
			warning: '='
		},
		link: function(scope, element) {
			var future;
			future = new Date(scope.date);
			$interval(function() {
				var diff;
				diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
				var remaining = Util.dhms(diff);
				scope.warning = remaining.warn;
				return element.text(remaining.remaining);
			}, 1000);
		}
	};
}]).factory('Util', [function() {
	return {
		dhms: function(t) {
			var days, hours, minutes, seconds;
			days = Math.floor(t / 86400);
			t -= days * 86400;
			hours = Math.floor(t / 3600) % 24;
			t -= hours * 3600;
			minutes = Math.floor(t / 60) % 60;
			t -= minutes * 60;
			seconds = t % 60;
			if(days < 30)
			{
				return {remaining: [days + ' days ', hours + ' hours ', minutes + ' minutes and ', seconds + ' seconds remaining '].join(' '), warn: true};
			}else{
				return {remaining: [days + ' days ', hours + ' hours ', minutes + ' minutes remaining '].join(' '), warn: false};
			}
		}
	};
}]);

directiveLibraryModule.provider('ngColorPickerConfig', function(){

	var templateUrl = '<ul><li ng-repeat="color in colors" style="outline:0;cursor:pointer" ng-class="{selected: (color===selected)}" ng-click="pick(color)" ng-style="{\'background-color\':color};"></li></ul>';
	var defaultColors =  [
			'#1dd2af','#3498db','#9b59b6','#34495e','#27ae60','#2980b9','#8e44ad','#2c3e50','#f1c40f','#e67e22','#e74c3c','#95a5a6','#f39c12','#c0392b','#7f8c8d'
		];
	this.setTemplateUrl = function(url){
		templateUrl = url;
		return this;
	};
	this.setDefaultColors = function(colors){
		defaultColors = colors;
		return this;
	};
	this.$get = function(){
		return {
			templateUrl : templateUrl,
			defaultColors: defaultColors
		}
	}
})
directiveLibraryModule.directive('ngColorPicker', ['ngColorPickerConfig',function(ngColorPickerConfig) {
	
	return {
		scope: {
			selected: '=',
			customizedColors: '=colors'
		},
		restrict: 'AE',
		template: ngColorPickerConfig.templateUrl,
		link: function (scope, element, attr) {
			scope.colors = scope.customizedColors || ngColorPickerConfig.defaultColors;
			scope.selected = scope.selected || scope.colors[0];

			scope.pick = function (color) {
				scope.selected = color;
			};

		}
	};

}]);

directiveLibraryModule.directive('isDisabledDark', [ '$rootScope', function($rootScope) {
	return {
		link: function(scope, element, attrs) {
			attrs.$observe('disabled', function(result) {
				if($rootScope.applyDark == true && result == true)
				{
					element.addClass('inputDisabledColor');
				}else{
					element.removeClass('inputDisabledColor');
				}
				
			});
		},
	}
}]);