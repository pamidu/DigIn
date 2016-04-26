/**
 * Created by Damith on 4/25/2016.
 */

//login with twitter
routerApp.factory('twitterService', function ($q, ngToast, $http) {
    var authorizationResult = false;


    function setLocalStorage(name, value) {
        localStorage.setItem(name, value);
    }

    function getLocalStorage(name) {
        return localStorage.getItem(name);
    }

    function deleteStorage(name) {
        localStorage.removeItem(name);
    }


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
                    setLocalStorage("@tiwitter_oauth", result);
                    setLocalStorage("@tiwitter_secret", result.oauth_token_secret);
                    setLocalStorage("@tiwitter_token", result.oauth_token);
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
            deleteStorage('@tiwitter_oauth');
            deleteStorage('@tiwitter_secret');
            deleteStorage('@tiwitter_token');
        },
        getStorage: function (name) {
            return getLocalStorage(name);
        },
        getHasTag: function (parameter) {
            return $http.get(parameter.apiBase + 'hashtag?' +
                'hashtag=' + parameter.tag +
                '&tokens={consumer_key:' + parameter.consumer_key + ',' +
                'consumer_secret:' + parameter.consumer_secret + ',' +
                'access_token:' + parameter.access_token + ',' +
                'access_token_secret:' + parameter.access_token_secret + '}', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        }
    }
})