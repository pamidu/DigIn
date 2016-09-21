    routerApp.directive("markable", function() {
        return {
            link: function(scope, elem, attrs) {
                elem.on("click", function() {
                    elem.addClass("active-condition");
                });
            }
        };
    }).directive("removeMarkable", function() {
        return {
            link: function(scope, elem, attrs) {
                elem.on("click", function() {
                    elem.addClass("de-active-condition");
                });
            }
        };
    }).directive("selectedSettingIcon", function() {
        return {
            link: function(scope, elem, attrs) {
                elem.on("click", function() {
                    elem.addClass("icon-select-ri1");
                });
            }
        };
    }).directive("findSelectTab", function() {
        return {
            link: function(scope, elem, attrs) {
                elem.on("click", function() {
                    elem.addClass("icon-select-ri1");
                });
            }
        };
    });