/**
 * Created by Damith on 4/25/2016.
 */

//login with twitter
routerApp.factory('twitterService', function ($q, ngToast) {
    var authorizationResult = false;

    function createCookie(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else var expires = "";
        document.cookie = name + "=" + value + expires;
    };

    function setCookie(name, value, days) {
        createCookie(name, value, days);
    };

    var getCookie = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    var deleteCookie = function (name) {
        createCookie(name, "", -1);
    };

    var fireMsg = function (msgType, content) {
        ngToast.dismiss();
        var _className;
        if (msgType == '0') {
            _className = 'danger';
        } else if (msgType == '1') {
            _className = 'success';
        }
        ngToast.create({
            className: _className,
            content: content,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            dismissOnClick: true,
            animation: 'slide'
        });
    };

    return {
        initialize: function () {
            //initialize OAuth.io with public key of the application
            OAuth.initialize('19gVB-kbrzsJWQs5o7Ha2LIeX4I', {
                cache: true
            });
            //try to create an authorization result when the page loads,
            // this means a returning user won't have to click the twitter button again
            authorizationResult = OAuth.create("twitter");
        }
        ,
        isReady: function () {
            return (authorizationResult);
        }
        ,
        connectTwitter: function () {
            var deferred = $q.defer();
            OAuth.popup("twitter", {
                cache: true,
            }, function (error, result) {
                // cache means to execute the callback if the tokens are already present
                if (!error) {
                    authorizationResult = result;
                    deferred.resolve();
                    createCookie("@tiwitter_oauth", result, Date.now());
                    createCookie("@tiwitter_secret", result.oauth_token_secret, Date.now());
                    createCookie("@tiwitter_token", result.oauth_token, Date.now());
                } else {
                    //do something if there's an error
                    fireMsg('0', 'twitter services error...' + error);
                    console.log(error);
                }
            });

            return deferred.promise;
        },
        clearCache: function () {
            OAuth.clearCache('twitter');
            authorizationResult = false;
            deleteCookie('@twitter_auth');
            deleteCookie('@tiwitter_secret');
            deleteCookie('@tiwitter_token');
        },
        getCookie: function (name) {
            return getCookie(name);
        }
    }
})