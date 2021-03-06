/*!
 * DiginHighCharts: v0.0.1
 * Authour: Binara Goonawardana
 */

'use strict';

var WhatIfModule = angular.module('WhatIf', ['DiginServiceLibrary', 'ngTextcomplete']);

WhatIfModule.directive('whatIf', ['$rootScope','$mdColors', '$timeout', function ($rootScope,$mdColors,$timeout) {
    return {
        restrict: 'E',
        controller: function() {
            var _targetSlider;
            var _sliderCollection = [];
            var _threshold = 0;

            this.setTargetSlider = function(slider) {
                if(typeof(slider) !== undefined) {
                    _targetSlider = slider
                    _threshold = _targetSlider.slider.noUiSlider.get();
                }
            }.bind(this);

            this.addToCollection = function(slider) {
                if(typeof(slider) !== undefined)
                    _sliderCollection.push(slider);
            }.bind(this);

            this.updateTarget = function(val, isDirectTargetSet) {
                // var currentTarget = _resolveFormula(this.config.equation);
                // _targetSlider.slider.noUiSlider.set(currentTarget[_targetSlider.name]);
                // angular.element('#'+_targetSlider.slider.id+' .noUi-connect').css('background', _getColor());

                if(isDirectTargetSet)
                     _targetSlider.slider.noUiSlider.set(val);
                else {
                    var currentTarget = _resolveFormula(this.config.equation);
                    _targetSlider.slider.noUiSlider.set(currentTarget[_targetSlider.name]);
                    angular.element('#'+_targetSlider.slider.id+' .noUi-connect').css('background', _getColor());
                }

            }.bind(this);

            this.setThreshhold = function() {
                _threshold = _targetSlider.slider.noUiSlider.get();
            }.bind(this);

            var _resolveFormula = function(formula) {
                var formula = formula;
                var fscope = _getFormulaScope();

                var code2 = math.compile(formula);
                code2.eval(fscope);

               return fscope;
            }

            var _getFormulaScope = function() {
                return _sliderCollection.reduce(function(acc, cur, i) {
                    acc[cur.name] = cur.slider.noUiSlider.get();
                    return acc;
                }, {});
            }

            var _getColor = function () {
                var _currentValue = parseFloat(_targetSlider.slider.noUiSlider.get());
                var _color = '';

                if(_currentValue > _threshold) _color = '#4CAF50';
                else if(_currentValue < _threshold) _color = '#FF5252';

                return _color;
            }

        },
        controllerAs: 'sCollCtrl',
        templateUrl: 'modules/WhatIf/whatIf.html',
        scope: {},
        bindToController: {
            config: '=',
            idSelector: '@'
        },
        link: function (scope, elem, attr, ctrl) {
			// $timeout(function(){
			// 	angular.element('.noUi-connect').css('background',$mdColors.getThemeColor($rootScope.theme+"-primary-300"));
			// 	angular.element('.noUi-handle').css('background',$mdColors.getThemeColor($rootScope.theme+"-accent-A700"));
			// }, 100);

            scope.editable = false;
			
			scope.$on('widget-resized', function(element, widget) {
				var height = widget.element[0].clientHeight - 50;
				var whatIfId = widget.element[0].children[2].children[0].getAttribute('id-selector');
				angular.element('#'+whatIfId).css('height',height+'px');
				//.noUi-connect
			});

            scope.$on('target-threshold-changed', function() {
                scope.$apply(function() {
                    scope.editable = true;
                });
            });

            scope.close = function() {
                scope.editable = false;
            }

            scope.checked = function() {
                scope.editable = false;
                ctrl.setThreshhold();
            }

		}
			
    };
}])

WhatIfModule.directive('sliderContainer', function() {
    return {
        restrict: 'E',
        scope: true,
        require: '^whatIf',
        transclude: true,
        controller: function() {
            this.func = function() {
               console.log('slider container func hits')
            }.bind(this);
        },
        controllerAs: 'sContCtrl',
        bindToController: true,
        template: '<div ng-transclude class="noUi-horizontal-size"></div>',
        link: function(scope, elem, attr) { }
    }
});

WhatIfModule.directive('slider', ['$rootScope', function($rootScope) {
    return {
        restrict: 'E',
        require: ['^whatIf','^sliderContainer'],
        scope: {
            name: '@',
            min: '=',
            max: '=',
            current: '=',
            target: '='
        },
        template: '<div id="{{::sliderId}}" style="margin-bottom:0px"></div>', 
        link: function(scope, elem, attr, ctrl) { 

            var sCollCtrl = ctrl[0];
            var sContCtrl = ctrl[1];

            var id = (!scope.name || 0 === scope.name.length) 
                        ? Date.now() + Math.floor((Math.random() * 100000) + 1)
                        : scope.name
                                        
            scope.sliderId = id + "_slider";
            
            var slider = elem.children()[0];

            (function(slider) {
                noUiSlider.create(slider, {
                    start: scope.current,
                    connect: [true, false],
                    tooltips: true,
                    animate: true,
                    animationDuration: 300,
                    step: 1,
                    range: {
                        'min': scope.min,
                        'max': scope.max
                    },
                    pips: {
                        mode: 'range',
                        density: 3
                    }
                });

                // Disabling the slider if it's a target  
                if(scope.target) {
                    var origins = slider.getElementsByClassName('noUi-origin');
                    origins[0].setAttribute('disabled', true);

                    slider.addEventListener('dblclick', function() {
                        $rootScope.$broadcast('target-threshold-changed');
                        origins[0].removeAttribute('disabled', true);
                    });

                    sCollCtrl.setTargetSlider({name: scope.name, slider: slider});
                }

                sCollCtrl.addToCollection({name: scope.name, slider: slider});

            })(slider);

            slider.noUiSlider.on('slide', function ( values, handle ) {
                sCollCtrl.updateTarget(values[handle], scope.target);
            });
        }
    }
}]);

WhatIfModule.directive('whatIfSettings', ['$rootScope', 'notifications', 'generateWhatIf',
    function($rootScope, notifications, generateWhatIf) {
        return {
            restrict: 'E',
            templateUrl: 'modules/WhatIf/whatIfSettings.html',
            scope: {
              whatifSettings: '=',
              submitForm: '&'
            },
            link: function(scope, element) {  

                if(!scope.whatifSettings.hasOwnProperty('eqconfig')) {
                    scope.whatifSettings['eqconfig'] = {};
                    scope.whatifSettings.eqconfig['mode'] = 'auto';
                    scope.whatifSettings.eqconfig['method'] = 'linear';
                    scope.whatifSettings.eqconfig['equation'] = '';
                    scope.whatifSettings.eqconfig['targets'] = []
                }

                scope.submit = function() {
                    if(scope.whatifSettingsForm.$valid) {
                        console.log(scope.whatifSettings);
                        scope.submitForm();
                    }else{
                        console.log("invalid");
                    }
                }
       
                scope.restoreSettings = function() {
                     scope.whatifSettings.eqconfig['targets'] = [];
                    scope.whatifSettings.eqconfig['mode'] = 'auto';
                    scope.whatifSettings.widgetName = "What If";
                }

                scope.changeFormulaGenerationMode = function(mode) {
                    scope.whatifSettings.eqconfig['targets'] = []
                }

                scope.setAsTarget = function(ev, value) {
                    if(scope.whatifSettings.eqconfig.targets.length > 0)
                        scope.whatifSettings.eqconfig.targets = []

                    scope.whatifSettings.eqconfig.targets.push(value.name)
                }

            } //end of link
        };
    }
]);

WhatIfModule.directive('textcomplete', ['Textcomplete', function (Textcomplete) {
    return {
        restrict: 'EA',
        scope: {
            members: '=',
            message: '='
        },
        template: '<textarea id="whatif-textarea" ng-model=\'message\' type=\'text\'></textarea>',
        link: function (scope, iElement, iAttrs) {
            
            // var mentions = scope.members;
            var mentions;
            scope.$watch('members', function(newVal) { mentions = newVal; });

            var opts = scope.operators;
            var ta = iElement.find('textarea');
            var textcomplete = new Textcomplete(ta, [
              {
                match: /(^|\s)@(\w*)$/,
                search: function(term, callback) {
                    callback($.map(mentions, function(mention) {
                        return mention.name.toLowerCase().indexOf(term.toLowerCase()) === 0 ? mention.name : null;
                    }));
                },
                index: 2,
                replace: function(mention) {
                    return '$1@' + mention + ' ';
                }
              }
            ]);

            $(textcomplete).on({
              'textComplete:select': function (e, value) {
                scope.$apply(function() {
                  scope.message = value
                })
              },
              'textComplete:show': function (e) {
                $(this).data('autocompleting', true);
              },
              'textComplete:hide': function (e) {
                $(this).data('autocompleting', false);
              }
            });

        }
    };
}]);

WhatIfModule.factory('generateWhatIf', ['$rootScope', '$http', 'notifications', 'Digin_Engine_API',
    function($rootScope, $http, notifications, Digin_Engine_API) {

        var generate = function(dbconfig, eqconfig, callback) {
            resolveFormula(buildFormulaParams(dbconfig, eqconfig), function(fdata) {
                callback(buildSlidersData(fdata.Result), fdata.Result.equation, fdata.Result.rsquare);
            });
        }

        var validate = function(config) {
            var isValid = true;

            if(typeof(config) === 'undefined')
                isValid = false;

            if(!config.seriesList || config.seriesList.length < 2) {
                notifications.toast(2, "Please select atleast two measures in order to generate What-If widget.");
                isValid = false;
            }
            
            // if(config.eqconfig.targets.length === 0) {
            //     notifications.toast(2, "Please select a one target measure from selected measures.");
            //     isValid = false;
            // }

            if(config.eqconfig.mode === 'manual' && 
                (config.eqconfig.equation === "" || config.eqconfig.equation === 'undefined')) {
                notifications.toast(2, "Manual formula generation mode requires equation as a input."); 
                isValid = false;
            }

            return isValid;
        }

        var resolveFormula = function(params, callback) {
            $http({
                url: Digin_Engine_API+'regression_analysis',
                method: 'GET',
                params: params
            }).then(function(response){
                if(response.status == 200)
                    if(response.data.hasOwnProperty('Is_Success') && response.data.Is_Success)
                        callback(response.data);
            }, function(err){
                console.log(err);
            });
        }

        var buildFormulaParams = function(dbconfig, eqconfig) {

            if(eqconfig.mode === 'manual')
                eqconfig.targets.push(eqconfig.equation.split("=")[0].replace(/@/g,'').trim());

            var fmeasures = getFormulaMeasureNames(eqconfig.variables, eqconfig.targets);

            return {
                dbtype: dbconfig.databaseType,
                table: dbconfig.dataTable,
                datasource_id: dbconfig.datasourceId,
                type: eqconfig.mode,
                method: eqconfig.method,
                equation: (eqconfig.mode === 'manual') 
                            ? JSON.stringify(formatEquation(eqconfig.equation)) 
                            : eqconfig.equation,
                y_values: JSON.stringify(fmeasures.yValues),
                x_values: JSON.stringify(fmeasures.xValues),
                SecurityToken: $rootScope.authObject.SecurityToken
            }
        }

        var buildSlidersData = function(fdata) {

                var initials = fdata.initial;
                var min_max = fdata.min_max;
        
                var columns_x = Object.keys(initials.x_initials);
                var columns_y = Object.keys(initials.y_initials);

                var x_values = columns_x.map(function(column) {
                    return {
                        name: column,
                        minimum: min_max.x.x_min[column],
                        maximum: min_max.x.x_max[column],
                        initial: initials.x_initials[column],
                        current: initials.x_initials[column],
                        target: false
                    }
                });

                var y_values = columns_y.map(function(column) {
                    return {
                        name: column,
                        minimum: min_max.y.y_min[column],
                        maximum: min_max.y.y_max[column],
                        initial: initials.y_initials[column],
                        current: initials.y_initials[column],
                        target: true
                    }
                });

                return y_values.concat(x_values);
        }

        var getFormulaMeasureNames = function(variables, targets) {
            return variables.reduce(function(acc, val, idx) {
                if(targets.indexOf(val.name) > -1) acc.yValues.push(val.name);
                else acc.xValues.push(val.name);
                return acc;
            },{xValues:[], yValues:[]});
        }

        var formatEquation = function(eq) {
            return [eq.replace(/[@\n ]+/g, "")];
        }

        return {
            generate: generate,
            validate: validate
        }
    }
]); //END OF generateWhatIf