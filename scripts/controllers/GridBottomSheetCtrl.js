routerApp.controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet,$mdDialog,Fullscreen) {
  $scope.items = [
    { name: 'Theme', icon: 'bower_components/material-design-icons/action/svg/production/ic_print_24px.svg' },
    { name: 'Share', icon: 'bower_components/material-design-icons/social/svg/production/ic_share_24px.svg' },
    { name: 'Export', icon: 'bower_components/material-design-icons/file/svg/production/ic_file_download_24px.svg' },
    { name: 'Print', icon: 'bower_components/material-design-icons/action/svg/production/ic_print_24px.svg' },
    {name:'Code',icon:'bower_components/material-design-icons/image/svg/production/ic_crop_free_24px.svg'},
    {name:'TV Mode',icon:'bower_components/material-design-icons/hardware/svg/production/ic_tv_24px.svg'},
    {name:'Help',icon:'bower_components/material-design-icons/action/svg/production/ic_help_24px.svg'}
  ];
  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    
    if(clickedItem.name=="Share")
    {
            $mdDialog.show({
            controller: 'shareCtrl',
      templateUrl: 'Views/dashboard-share.html',
        resolve: {
          
        }
    });
    }
     if(clickedItem.name=="Theme")
    {
            $mdDialog.show({
            controller: 'ThemeCtrl',
      templateUrl: 'Views/change-theme.html',
        resolve: {
          
        }
    });
    }
     if(clickedItem.name=="Export")
    {
            $mdDialog.show({
            controller: 'ExportCtrl',
      templateUrl: 'Views/chart_export.html',
        resolve: {
          
        }

    });
    }
       if(clickedItem.name=="TV Mode")
    {
      
      if (Fullscreen.isEnabled())
         Fullscreen.cancel();
      else
         Fullscreen.all();
    }
      if(clickedItem.name=="Help")
      {
            $mdDialog.show({
            controller: 'HelpCtrl',
      templateUrl: 'Views/help.html',
        resolve: {
          
        }
      });

       
    }
    $mdBottomSheet.hide(clickedItem);
  };
});
 

routerApp.controller('HelpCtrl', function($scope, $mdBottomSheet,$mdDialog,cssInjector) {
  
    $scope.closeDialog = function() {
      $mdDialog.hide();
    };
    


  });