app.controller('ImportExportController', ['$scope', '$mdDialog', '$rootScope', 'dataHandler', 'Upload', '$http', function ($scope, $mdDialog, $rootScope, dataHandler, Upload, $http) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.publish = function () {
        console.log("Publish button was clicked.");
    }
    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.importFile = function (data) {
        console.log(data);
        var filename = data.name;
        console.log(filename);

        var reader = new FileReader();
        reader.onload = function (e) {
            data = e.target.result;
            data = data.replace("data:;base64,", "");
            data = Base64.decode(data);
            data = Base64.decode(data);
            data = JSON.parse(data);
            var returnObj = {
                "data": data[0],
                "event": event
            }
            $mdDialog.hide(returnObj);
        };

        reader.readAsDataURL(data);


        //        var era = Upload.upload({
        //            url: "json/import.php",
        //            data: {
        //                rename: new Date()
        //            },
        //            file: data,
        //        }).success(function (data, status, headers, config) {
        //            // file is uploaded successfully
        //            console.log(data);
        //            $http.get('json/import/' + filename).success(function (data) {
        //
        //                data = JSON.parse(Base64.decode(data));
        //                console.log(data);
        //                var returnObj = {
        //                    "data": data[0],
        //                    "event": event
        //                }
        //                $mdDialog.hide(returnObj);
        //            }).error(function (data) {
        //                console.log(data);
        //            });
        //        });



    };

    $scope.createuuid = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

    $scope.process = {
        name: "",

    };

    var Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function (e) {
            var t = "";
            var n, r, i, s, o, u, a;
            var f = 0;
            e = Base64._utf8_encode(e);
            while (f < e.length) {
                n = e.charCodeAt(f++);
                r = e.charCodeAt(f++);
                i = e.charCodeAt(f++);
                s = n >> 2;
                o = (n & 3) << 4 | r >> 4;
                u = (r & 15) << 2 | i >> 6;
                a = i & 63;
                if (isNaN(r)) {
                    u = a = 64
                } else if (isNaN(i)) {
                    a = 64
                }
                t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
            }
            return t
        },
        decode: function (e) {
            var t = "";
            var n, r, i;
            var s, o, u, a;
            var f = 0;
            e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (f < e.length) {
                s = this._keyStr.indexOf(e.charAt(f++));
                o = this._keyStr.indexOf(e.charAt(f++));
                u = this._keyStr.indexOf(e.charAt(f++));
                a = this._keyStr.indexOf(e.charAt(f++));
                n = s << 2 | o >> 4;
                r = (o & 15) << 4 | u >> 2;
                i = (u & 3) << 6 | a;
                t = t + String.fromCharCode(n);
                if (u != 64) {
                    t = t + String.fromCharCode(r)
                }
                if (a != 64) {
                    t = t + String.fromCharCode(i)
                }
            }
            t = Base64._utf8_decode(t);
            return t
        },
        _utf8_encode: function (e) {
            e = e.replace(/\r\n/g, "\n");
            var t = "";
            for (var n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r)
                } else if (r > 127 && r < 2048) {
                    t += String.fromCharCode(r >> 6 | 192);
                    t += String.fromCharCode(r & 63 | 128)
                } else {
                    t += String.fromCharCode(r >> 12 | 224);
                    t += String.fromCharCode(r >> 6 & 63 | 128);
                    t += String.fromCharCode(r & 63 | 128)
                }
            }
            return t
        },
        _utf8_decode: function (e) {
            var t = "";
            var n = 0;
            var r = c1 = c2 = 0;
            while (n < e.length) {
                r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r);
                    n++
                } else if (r > 191 && r < 224) {
                    c2 = e.charCodeAt(n + 1);
                    t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                    n += 2
                } else {
                    c2 = e.charCodeAt(n + 1);
                    c3 = e.charCodeAt(n + 2);
                    t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                    n += 3
                }
            }
            return t
        }
    }


    $scope.exportFile = function () {
        var flowChartJson = dataHandler.getSaveJson();
        $rootScope.WFID = $scope.createuuid();
        var saveObject = {
            "ID": $scope.createuuid(),
            "WFID": $rootScope.WFID,
            "Name": $scope.process.name,
            "Description": $scope.process.description,
            "version": $scope.process.version,
            "DateTime": new Date(),
            "UserName": $rootScope.currentUser,
            "JSONData": flowChartJson,

        };
        $scope.data = [];
        $scope.data.push(saveObject);
        console.log($scope.data);
        $scope.data = Base64.encode(JSON.stringify($scope.data));

        console.log($scope.data);
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + $scope.data);
        element.setAttribute('download', $scope.process.name + ".pd");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
        $mdDialog.hide();
    };

    $scope.theme = sessionStorage.cur_theme || 'default';

    $rootScope.changeColor = function () {
        //$scope.theme = color.theme;
        $scope.theme = sessionStorage.cur_theme || 'default';
        $scope.themeList = ThemeService();
        console.log('Current Theme', $scope.theme);
        $scope.clickIconMorph = function (value) {
            console.log(value);
            if (value != undefined) {
                $scope.theme = value + '-theme';
                sessionStorage.setItem("cur_theme", $scope.theme);
                console.log('Changed theme', $scope.theme, value);
                $scope.accent_color = value;
                //$scope.$apply();
                //$scope.$digest();
            }
        };
    }

}]);
