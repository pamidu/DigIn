DiginApp.controller( 'wordpressInitCtrl' ,['$scope', '$http', '$mdDialog', 'widgetID', '$rootScope', 'DiginServices', 'notifications',
    function ($scope, $http, $mdDialog, widgetID, $rootScope,DiginServices, notifications) {

		$scope.cancel = function()
		{
			$mdDialog.cancel();
		}
		
		$scope.finish = function(){
			console.log($scope.wpdomain);
			
			$scope.diginLogo = 'digin-logo-wrapper2';
				var wpapi = "http://public-api.wordpress.com/rest/v1/sites/";
				var choice = "/posts";
				var callbackString = '/?callback=JSON_CALLBACK';

				var message = $http.jsonp(wpapi + $scope.wpdomain + choice + callbackString).
				success(function(data, status) {
					var objIndex = DiginServices.getRootObjectById(widgetID, $rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].widgets);
					console.log(objIndex);
					var posts = data.posts;
					var trimmedPosts = [];
					var tempTitle = "";

					for (i = 0; i < posts.length; i++) {
						var obj = {
							picURL: "",
							authorName: "",
							title: "",
							comments: "",
							likes: ""
						};
						obj.picURL = posts[i].author.avatar_URL;
						obj.authorName = posts[i].author.name;
						obj.title = posts[i].title;
						obj.comments = posts[i].comment_count;
						obj.date = posts[i].date

						trimmedPosts.push(obj);
					}
					var trimmedObj = {};
					trimmedObj.posts = trimmedPosts;
					$rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].widgets[objIndex].widgetData.widData = trimmedObj;
					$mdDialog.hide();
					
				}).error(function(data, status) {
					notifications.toast(0,"Error Occurred, Check your url");
				});
			
		}
    }
]);