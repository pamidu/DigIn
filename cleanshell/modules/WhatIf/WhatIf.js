/*!
 * DiginHighCharts: v0.0.1
 * Authour: Binara Goonawardana
 */

'use strict';

var WhatIfModule = angular.module('WhatIf', ['DiginServiceLibrary']);

/*
WhatIfModule.directive('whatIf', ['$rootScope', 'notifications', 'generateWhatIf',
    function($rootScope, notifications, generateWhatIf) {
        return {
            restrict: 'E',
            templateUrl: 'modules/WhatIf/WhatIf.html',
            scope: {
                config: '='
            },
            link: function(scope, element) {
                console.log(scope.config);
            } //end of link
        };
    }
]);
*/

WhatIfModule.directive('whatIf', [function () {
    return {
        restrict: 'E',
        controller: function() {
            var _targetSlider;
            var _sliderCollection = [];

            this.setTargetSlider = function(slider) {
                if(typeof(slider) !== undefined)
                    _targetSlider = slider
            }.bind(this);

            this.addToCollection = function(slider) {
                if(typeof(slider) !== undefined)
                    _sliderCollection.push(slider);
            }.bind(this);

            this.updateTarget = function(val) {
                var currentTarget = _resolveFormula();
            }.bind(this);

            var _resolveFormula = function() {
                var formula = "sales=profit+product_base_margin"
                var fscope = _getFormulaScope();

                var code2 = math.compile(formula);
                code2.eval(fscope);

                _targetSlider.slider.noUiSlider.set(fscope[_targetSlider.name]);
            }

            var _getFormulaScope = function() {
                return _sliderCollection.reduce(function(acc, cur, i) {
                    acc[cur.name] = cur.slider.noUiSlider.get();
                    return acc;
                }, {});
            }

        },
        controllerAs: 'sCollCtrl',
        templateUrl: 'modules/WhatIf/WhatIf.html',
        scope: {
            config: '=',
            idSelector: '@'
        },
        bindToController: true,
        link: function (scope, elem, attr) { console.log(scope.sCollCtrl.config.variables);  }
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
        template: '<div ng-transclude></div>',
        link: function(scope, elem, attr) { console.log('sliderContainer hits')}
    }
});

WhatIfModule.directive('slider', function() {
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
        template: '<div id="{{::sliderId}}" style="margin-bottom:70px"></div>', 
        link: function(scope, elem, attr, ctrl) { 
            console.log('slider hits');

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
                    slider.setAttribute('disabled', true);
                    sCollCtrl.setTargetSlider({name: scope.name, slider: slider})
                }

                sCollCtrl.addToCollection({name: scope.name, slider: slider});

            })(slider);

            slider.noUiSlider.on('slide', function ( values, handle ) {
                sCollCtrl.updateTarget(values[handle]);
            });
        }
    }
});

WhatIfModule.directive('whatIfSettings', ['$rootScope', 'notifications', 'generateWhatIf',
    function($rootScope, notifications, generateWhatIf) {
        return {
            restrict: 'E',
            templateUrl: 'modules/WhatIf/WhatIfSettings.html',
            scope: {
              whatifSettings: '=',
              submitForm: '&'
            },
            link: function(scope, element) {  
                scope.mode = 'auto' 
                scope.setTarget = function(t) { console.log(t); } 

                scope.submit = function() {
                    if(scope.whatifSettingsForm.$valid) {
                        console.log(scope.whatifSettings);
                        scope.submitForm();
                    }else{
                        console.log("invalid");
                    }
                }
       
                scope.restoreSettings = function() {
                     scope.submitForm();
                }
            } //end of link
        };
    }
]);

WhatIfModule.factory('generateWhatIf', ['$rootScope', 'notifications',
    function($rootScope, notifications) {

        

        return {
            generate: function() {},
            validateWhatIf: function() {},
        }
    }
]); //END OF generateWhatIf