/**
 * Created by Damith on 7/26/2016.
 */

routerApp.controller('userProfileCtrl', function ($scope,$state) {

    console.log('user profile ctrl load');

	
    //profile view mode
    $scope.editModeOn = true;
	
	$scope.user = {name: "Dilshan",company: "Duo", email:"nelly.dil@hotmail.com",contactNo:"0767124324",street:"Thalapathpitiya",country:"Sri Lanka",zip:"04215"};
	
	
    $scope.profile = (function () {
        return {
            clickEdit: function () {
                $scope.editModeOn = false;
            },
			changeUserProfile: function (){
				console.log($scope.user);
				$scope.editModeOn = true;
			},
            closeEdit: function () {
                $scope.editModeOn = false;
            },
            closeSetting: function () {
                $state.go('home');
            }
        }
    })();

    //UI animation
	
    var uiAnimation = (function () {
        return {
            openEditPanel: function (id, status) {
                $(id).animate({
                    opacity: '1'
                })
            },
            closeEditPanel: function (id, status) {
                $(id).animate({
                    opacity: '0'
                })
            }
        }
    })();


});
