<?php
	class appcategories{
		public $id;
		public $categoryname;
		public $description;

	}
	class rating{
		public $appkey;
		public $userid;
		public $stars;
		public $title;
		public $description;
		public $imageurl;
		public $date;
		public $name;


	}
	class avgrating{
		public $appkey;
		public $rating;
	}
	class deletrating{
		public $appkey;
		public $userid;
	}
	
	class toprated{
		public $date;
		public $apps;
	}
	class topratingsdata{
		public $appkey;
		public $category;
		public $avgrating;
		public $one;
		public $two;
		public $three;
		public $four;
		public $five;
		public $app;
	}
	class AppMarketplaceService {

		private function test(){
			echo "Hello from media service";
		}

		private function getAllApps(){
			$client = ObjectStoreClient::WithNamespace("duoworld.com","appstoreapps","123");
			$allObjects = $client->get()->all();
			echo json_encode($allObjects);
		}
		private function setCategory($categoryname,$description){
			$category=new appcategories();
			$client = ObjectStoreClient::WithNamespace("duoworld.com","appcategories","123");
			$checkavailability=$client->get()->andSearch("categoryname:".$categoryname);
			if(empty($checkavailability)){
				$category->id="-999";
				$category->categoryname="$categoryname";
				$category->description="$description";
				$storeReply=$client->store()->byKeyField("id")->andStore($category);
				if(empty($storeReply)){
					header('Content-type: application/json');
					echo json_encode('{"success":"fail","reason":"error occured..."}');
				}else{
					header('Content-type: application/json');
					echo json_encode('{"success":"success","reason":"'. $storeReply->IsSuccess .'"}');
				}
				
			}else{
				header('Content-type: application/json');
				echo json_encode('{"success":"fail","reason":"catogeryname Already available"}');
			}
		}
		private function getAllCategory(){
			$client = ObjectStoreClient::WithNamespace("duoworld.com","appcategories","123");
			$Categorylist= $client->get()->all();
			echo json_encode($Categorylist);

		}
		private function getAppsByCategory($catname, $skip, $take){
			$client = ObjectStoreClient::WithNamespace("duoworld.com","appstoreapps","123");
			$checkavailability=$client->get()->andSearch("catogery:".$catname);
			echo json_encode($checkavailability);
		}
		private function getAppsByKey($key){
			$clientTopdetails = ObjectStoreClient::WithNamespace("duoworld.com","appstoreapps","123");
			$topdetails=$clientTopdetails->get()->bykey($key);
			echo json_encode($topdetails);

		}
		private function addRating(){
			$rating=new rating();
			DuoWorldCommon::mapToObject(Flight::request()->data,$rating);
			$rating->date=date("Y-M-d");
			// echo json_encode($rating);
			$client = ObjectStoreClient::WithNamespace("duoworld.com",$rating->appkey,"123");
			$ratingifAvailable=$client->get()->bykey($rating->userid);
			if(empty($ratingifAvailable)){
				$storeReply=$client->store()->byKeyField("userid")->andStore($rating);			
				$topratingsdata=new topratingsdata();
				$clientTopdetails = ObjectStoreClient::WithNamespace("duoworld.com","toprateddetails","123");
				$topdetails=$clientTopdetails->get()->bykey($rating->appkey);
				if(empty($topdetails)){
					$topratingsdata->one=0;
					$topratingsdata->two=0;
					$topratingsdata->three=0;
					$topratingsdata->four=0;
					$topratingsdata->five=0;
						if($rating->stars==1){
							$topratingsdata->one=1;
						}else if ($rating->stars==2){
							$topratingsdata->two=1;
						}else if($rating->stars==3){
							$topratingsdata->three=1;
						}else if ($rating->stars==4){
							$topratingsdata->four=1;
						}else if ($rating->stars==5){
							$topratingsdata->five=1;
						}

					$topratingsdata->avgrating=round((($topratingsdata->one*1)+($topratingsdata->two*2)+($topratingsdata->three*3)+($topratingsdata->four*4)+($topratingsdata->five*5))/(($topratingsdata->one)+($topratingsdata->two)+($topratingsdata->three)+($topratingsdata->four)+($topratingsdata->five)), 1, PHP_ROUND_HALF_UP);
					$clientapps = ObjectStoreClient::WithNamespace("duoworld.com","appstoreapps","123");
					$allObjects = $clientapps->get()->bykey($rating->appkey);
					$topratingsdata->appkey=$rating->appkey;
					$topratingsdata->category=$allObjects->catogery;
					$allObjects->rating=$topratingsdata->avgrating;
					$storeReply=$clientapps->store()->byKeyField("appkey")->andStore($allObjects);
					$topratingsdata->app=$allObjects;
					//echo json_encode($topratingsdata);
						
					$storeReply=$clientTopdetails->store()->byKeyField("appkey")->andStore($topratingsdata);
					echo json_encode($storeReply);
				}else{
					if($rating->stars==1){
						$topdetails->one=$topdetails->one+1;
					}else if ($rating->stars==2){
						$topdetails->two=$topdetails->two+1;
					}else if($rating->stars==3){
						$topdetails->three=$topdetails->three+1;
					}else if ($rating->stars==4){
						$topdetails->four=$topdetails->four+1;
					}else if ($rating->stars==5){
						$topdetails->five=$topdetails->five+1;
					}
					$topdetails->avgrating=round((($topdetails->one*1)+($topdetails->two*2)+($topdetails->three*3)+($topdetails->four*4)+($topdetails->five*5))/(($topdetails->one)+($topdetails->two)+($topdetails->three)+($topdetails->four)+($topdetails->five)), 1, PHP_ROUND_HALF_UP);
					$clientapps = ObjectStoreClient::WithNamespace("duoworld.com","appstoreapps","123");
					$allObjects = $clientapps->get()->bykey($rating->appkey);
					$allObjects->rating=$topdetails->avgrating;
					$storeReply=$clientapps->store()->byKeyField("appkey")->andStore($allObjects);
					$topdetails->app=$allObjects;
					//echo json_encode($topdetails);

					$storeReply=$clientTopdetails->store()->byKeyField("appkey")->andStore($topdetails);
					echo json_encode($storeReply);
				}
				
			}else{
				$currentstars=$ratingifAvailable->stars;
				$storeReply=$client->store()->byKeyField("userid")->andStore($rating);
				$topratingsdata=new topratingsdata();
				$clientTopdetails = ObjectStoreClient::WithNamespace("duoworld.com","toprateddetails","123");
				$topdetails=$clientTopdetails->get()->bykey($rating->appkey);
				if(empty($topdetails)){
					$topratingsdata->appkey=$rating->appkey;
					$topratingsdata->one=0;
					$topratingsdata->two=0;
					$topratingsdata->three=0;
					$topratingsdata->four=0;
					$topratingsdata->five=0;
						if($rating->stars==1){
							$topratingsdata->one=1;
						}else if ($rating->stars==2){
							$topratingsdata->two=1;
						}else if($rating->stars==3){
							$topratingsdata->three=1;
						}else if ($rating->stars==4){
							$topratingsdata->four=1;
						}else if ($rating->stars==5){
							$topratingsdata->five=1;
						}
					$topratingsdata->avgrating=round((($topratingsdata->one*1)+($topratingsdata->two*2)+($topratingsdata->three*3)+($topratingsdata->four*4)+($topratingsdata->five*5))/(($topratingsdata->one)+($topratingsdata->two)+($topratingsdata->three)+($topratingsdata->four)+($topratingsdata->five)), 1, PHP_ROUND_HALF_UP);
					$clientapps = ObjectStoreClient::WithNamespace("duoworld.com","appstoreapps","123");
					$allObjects = $clientapps->get()->bykey($rating->appkey);
					
					$allObjects->rating=$topratingsdata->avgrating;
					$storeReply=$clientapps->store()->byKeyField("appkey")->andStore($allObjects);
					
					$topratingsdata->appkey=$rating->appkey;
					$topratingsdata->category=$allObjects->catogery;
					$topratingsdata->app=$allObjects;
					//echo json_encode($topratingsdata);
					
					$storeReply=$clientTopdetails->store()->byKeyField("appkey")->andStore($topratingsdata);
					echo json_encode($topratingsdata);
				}else{
					if($currentstars==1){
						if($topdetails->one>0){
							$topdetails->one=$topdetails->one-1;
						}
					}else if($currentstars==2){
						if($topdetails->two>0){
							$topdetails->two=$topdetails->two-1;
						}
					}else if($currentstars==3){
						if($topdetails->three>0){
							$topdetails->three=$topdetails->three-1;
						}
					}else if($currentstars==4){
						if($topdetails->four>0){
							$topdetails->four=$topdetails->four-1;
						}
					}else if($currentstars==5){
						if($topdetails->five>0){
							$topdetails->five=$topdetails->five-1;
						}
					}
								
					if($rating->stars==1){
						$topdetails->one=$topdetails->one+1;
					}else if ($rating->stars==2){
						$topdetails->two=$topdetails->two+1;
					}else if($rating->stars==3){
						$topdetails->three=$topdetails->three+1;
					}else if ($rating->stars==4){
						$topdetails->four=$topdetails->four+1;
					}else if ($rating->stars==5){
						$topdetails->five=$topdetails->five+1;
					}
					$topdetails->avgrating=round((($topdetails->one*1)+($topdetails->two*2)+($topdetails->three*3)+($topdetails->four*4)+($topdetails->five*5))/(($topdetails->one)+($topdetails->two)+($topdetails->three)+($topdetails->four)+($topdetails->five)), 1, PHP_ROUND_HALF_UP);
					$clientapps = ObjectStoreClient::WithNamespace("duoworld.com","appstoreapps","123");
					$allObjects = $clientapps->get()->bykey($rating->appkey);
					
					$allObjects->rating=$topdetails->avgrating;
					$storeReply=$clientapps->store()->byKeyField("appkey")->andStore($allObjects);
					
					$topdetails->appkey=$rating->appkey;
					$topdetails->category=$allObjects->catogery;
					$topdetails->app=$allObjects;
					//echo json_encode($topdetails);

					
					$storeReply=$clientTopdetails->store()->byKeyField("appkey")->andStore($topdetails);
					echo json_encode($storeReply);
				}
				

			}

		}
		private function getAllRating($appkey){
			$client = ObjectStoreClient::WithNamespace("duoworld.com",$appkey,"123");
			$allObjects = $client->get()->all();
			echo json_encode($allObjects);


		}
		
		private function topRatedApps(){
			$clientTopdetails = ObjectStoreClient::WithNamespace("duoworld.com","toprateddetails","123");
			$alltopapps=$clientTopdetails->get()->byFiltering("select * from toprateddetails group by category order by avgrating desc limit 5");
			echo json_encode($alltopapps);
			

		}
		private function deleteRating(){
			$rating=new rating();
			$topratingsdata=new topratingsdata();
			DuoWorldCommon::mapToObject(Flight::request()->data,$rating);
			$clientTopdetails = ObjectStoreClient::WithNamespace("duoworld.com","toprateddetails","123");
				$topdetails=$clientTopdetails->get()->bykey($rating->appkey);
				//echo json_encode($topdetails);
				if(!empty($topdetails)){
						if($rating->stars==1){
							$topdetails->one=$topdetails->one-1;
							if($topdetails->one<0){
								$topdetails->one=0;
							}
						}else if ($rating->stars==2){
							$topdetails->two=$topdetails->two-1;
							if($topdetails->stars<0){
								$topdetails->stars=0;
							}
						}else if($rating->stars==3){
							$topdetails->three=$topdetails->three-1;
							if($topdetails->three<0){
								$topdetails->three=0;
							}
						}else if ($rating->stars==4){
							$topdetails->four=$topdetails->four-1;
							if($topdetails->four<0){
								$topdetails->four=0;
							}
						}else if ($rating->stars==5){
							$topdetails->five=$topdetails->five-1;
							if($topdetails->five<0){
								$topdetails->five=0;
							}
						}

					$downsection=($topratingsdata->one)+($topratingsdata->two)+($topratingsdata->three)+($topratingsdata->four)+($topratingsdata->five);
					if($downsection<=0){
						$downsection=1;
					}

					$topdetails->avgrating=round((($topdetails->one*1)+($topdetails->two*2)+($topdetails->three*3)+($topdetails->four*4)+($topdetails->five*5))/($downsection), 1, PHP_ROUND_HALF_UP);
					$clientapps = ObjectStoreClient::WithNamespace("duoworld.com","appstoreapps","123");
					$app = $clientapps->get()->bykey($rating->appkey);
					$topdetails->appkey=$rating->appkey;
					$topdetails->category=$app->catogery;
					$app->rating=$topdetails->avgrating;
					$storeReply=$clientapps->store()->byKeyField("appkey")->andStore($app);
					$topdetails->app=$app;
					//echo json_encode($topratingsdata);
						
					$storeReply=$clientTopdetails->store()->byKeyField("appkey")->andStore($topdetails);
					$client = ObjectStoreClient::WithNamespace("duoworld.com",$rating->appkey,"123");
					//$objecttodelete=$client->get()->bykey($rating->userid);
					$Respond=$client->delete()->byKeyField("userid")->andDelete($rating);
					echo json_encode($Respond);
				}

		}
		private function getNewReleaseApps(){
			
		}
		private function getmyApps(){
			
		}
		private function getFeaturedApps(){
			
		}
		private function globSearch($key){
			$clientTopdetails = ObjectStoreClient::WithNamespace("duoworld.com","appstoreapps","123");
			$alltopapps=$clientTopdetails->get()->byFiltering("select * from appstoreapps WHERE name LIKE '%".$key."%';");
			echo json_encode($alltopapps);

		}

		

		



		function __construct(){
			Flight::route("GET /test",function(){$this->test();});		
			Flight::route("GET /", function(){$this->getAllApps();});
			Flight::route("GET /setCategory/@categoryname/@description", function($categoryname,$description){$this->setCategory($categoryname,$description);});
			Flight::route("GET /getAllCategory",function(){$this->getAllCategory();});
			Flight::route("GET /getAppsByCategory/@catname/@skip/@take",function($catname, $skip, $take){$this->getAppsByCategory($catname, $skip, $take);});	
			Flight::route("GET /getAppByKey/@key",function($key){$this->getAppsByKey($key);});
			Flight::route("POST /addRating",function(){$this->addRating();});
			Flight::route("GET /getAllRating/@appkey",function($appkey){$this->getAllRating($appkey);});
			Flight::route("GET /topRatedApps",function(){$this->topRatedApps();});
			Flight::route("POST /deleteRating",function(){$this->deleteRating();});
			Flight::route("GET /getNewReleaseApps",function(){$this->getNewReleaseApps();});
			Flight::route("GET /getmyApps",function(){$this->getmyApps();});

			Flight::route("GET /getFeaturedApps",function(){$this->getFeaturedApps();});
			Flight::route("GET /globSearch/@key",function($key){$this->globSearch($key);});

			header('Content-Type: application/json');
			header('Access-Control-Allow-Headers: Content-Type');
			header('Access-Control-Allow-Origin: *');
			header('Access-Control-Allow-Methods: GET, POST');
		
		}
	}

?>
