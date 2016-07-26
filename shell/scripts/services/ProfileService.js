routerApp.service('ProfileService',function(){

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

	

});