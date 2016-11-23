DiginApp.controller('themeCtrl',[ '$scope', '$rootScope','$mdDialog','colorManager', function ($scope,$rootScope,$mdDialog, colorManager){
		$scope.$parent.currentView = "Themes";
		
		
		$scope.themeColor = [
			{name:"Join the Dark side", imageUrl:"devil.png", theme:"Dark", backgroundColor: "rgb(66,66,66)", color: "white"},
			{name:"Come to the Light", imageUrl:"angel.png", theme:"Light", backgroundColor: "rgb(187, 187, 187)", color: "black" }
		]
		
		$scope.palette = [
			{name:"Default", imageUrl:"default.png", theme:"default"},
			{name:"Red", imageUrl:"red.png", theme:"redTheme"},
			{name:"Purple", imageUrl:"purple.png", theme:"purpleTheme"},
			{name:"Orange", imageUrl:"orange.png", theme:"orangeTheme"},
			{name:"Blue", imageUrl:"blue.png", theme:"blueTheme"},
			{name:"Green", imageUrl:"green.png", theme:"greenTheme"}
		]
		
		$scope.mainTheme = function(color)
		{
			colorManager.changeMainTheme(color);
		}
		
		$scope.changeTheme = function(color)
		{
			
			if($rootScope.lightOrDark == "Dark")
			{
				colorManager.changeTheme(color.theme+"Dark");
			}else
			{
				colorManager.changeTheme(color.theme);
			}
		}
		

}])