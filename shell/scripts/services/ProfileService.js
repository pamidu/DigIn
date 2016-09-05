routerApp.service('ProfileService',function($http,Digin_Engine_API,Digin_Domain){

	// user profile INformations --
		
		this.widget_limit;
		this.UserDataArr = {

			Name:"",
			Email:"",
			BillingAddress:"",
			PhoneNumber:"",
			Company:"",
			BannerPicture:"",
			Country:"",
			ZipCode:""

		};
	
		this.InitProfileData = function (response){

			this.UserDataArr = response;

		};

	// user settings informations 
		this.widget_limit = "";

});