/**
 * Created by Damith on 7/26/2016.
 */

routerApp.controller('userProfileCtrl', function ($scope,$state) {

    console.log('user profile ctrl load');

    //profile view mode
    $scope.editModeState = false;
    $scope.profile = (function () {
        return {
            clickEdit: function () {
                $scope.editModeState = true;
            },
            closeEdit: function () {
                $scope.editModeState = false;
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
