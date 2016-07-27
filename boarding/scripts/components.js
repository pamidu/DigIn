p_boarding_module.service('objectFormat', function($rootScope){

		this.format = function(obj) {
		    console.log(obj);
		    return {
                TenantID : obj.name.toLowerCase(),
                Type : obj.type,
                Name: obj.company,
                Shell: "shell/index.html#/duoworld-framework/dock",
                Statistic: $rootScope.package,
                Private: (obj.accessLevel == "private") ? true : false,
                OtherData:
                    {
                        CompanyName: obj.company,
                        SampleAttributs: "Values",
                        catagory: obj.businessModel
                    }
            };
		}
		
})

p_boarding_module.filter("filterByPattern", function($rootScope) {
    return function (cardTypes, CardNo) {
		if(!CardNo)
		{
			CardNo = "";
			return cardTypes;
		}
		for (i = 0, len = cardTypes.length; i<len; ++i){

			for (j = 0, len = cardTypes[i].validPatterns.length; j<len; ++j){
				var contains = cardTypes[i].validPatterns[j].startsWith(CardNo.substring(0, 2));
				if(contains === true)
				{
					$rootScope.cardTypeRoot = cardTypes[i];
					return [cardTypes[i]];
				}
			}
		}
    }
 })
 
p_boarding_module.directive('angularMask', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, el, attrs, model) {
        var format = attrs.angularMask,
          arrFormat = format.split('|');

        if (arrFormat.length > 1) {
          arrFormat.sort(function (a, b) {
            return a.length - b.length;
          });
        }

        model.$formatters.push(function (value) {
          return value === null ? '' : mask(String(value).replace(/\D/g, ''));
        });

        model.$parsers.push(function (value) {
          model.$viewValue = mask(value);
          var modelValue = String(value).replace(/\D/g, '');
          el.val(model.$viewValue);
          return modelValue;
        });

        function mask(val) {
          if (val === null) {
            return '';
          }
          var value = String(val).replace(/\D/g, '');
          if (arrFormat.length > 1) {
            for (var a in arrFormat) {
              if (value.replace(/\D/g, '').length <= arrFormat[a].replace(/\D/g, '').length) {
                format = arrFormat[a];
                break;
              }
            }
          }
          var newValue = '';
          for (var nmI = 0, mI = 0; mI < format.length;) {
            if (format[mI].match(/\D/)) {
              newValue += format[mI];
            } else {
              if (value[nmI] != undefined) {
                newValue += value[nmI];
                nmI++;
              } else {
                break;
              }
            }
            mI++;
          }
          return newValue;
        }
      }
    };
  });
  
//Hide the Account Numbers in show all Accounts
p_boarding_module.filter('hideNumbers', function() {
  return function(input) {
	return input.replace(/.(?=.{4})/g, 'x');
  };
});
