DiginApp.controller('accountSettingsCtrl',[ '$scope','$mdDialog', function ($scope,$mdDialog){
	
	$scope.$parent.currentView = "Settings";
	
	console.log($scope.dashboards);
	
	console.log('Settings');
	
	Highcharts.chart('container', {
		  title: {
			text: 'Bandwidth Usage'
		  },
		  chart: {
			type: "line"
			
			},

		  xAxis: {
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
			  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
			]
		  },

		  series: [{
			data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
		  }]
	});
	
	$scope.uploadCompanyLogo = function(ev)
	{
		$mdDialog.show({
		  controller: "uploadCompanyLogoCtrl",
		  templateUrl: 'views/settings/accountSettings/uploadCompanyLogo.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:true
		})
		.then(function(answer) {
		})
	}
	
}])

DiginApp.controller('uploadCompanyLogoCtrl',['$scope','$mdDialog','$http','notifications' ,function ($scope,$mdDialog,$http,notifications) {
	
	$scope.fileChanged = function(e)
	{
		if( !e ) e = window.event;
		var x = e.target||e.srcElement;
		
		var file = e.target.files[0];
		var reader = new FileReader();
		reader.onload = function(){
			$scope.theImage1 = reader.result;
			$scope.$apply();
		};
		reader.readAsDataURL(file);
	}
	
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
	$scope.submit = function()
	{
		var profileImg = document.getElementById('profileImg');
		var profileImgSrc = profileImg.src;
		console.log(profileImgSrc);
	}
}])