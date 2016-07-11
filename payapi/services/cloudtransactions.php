<?php
	require_once (BASE_PATH . "/duoapi/extservices.php");
	require_once (BASE_PATH . "/duoapi/appinstaller.php");
	
	class Trasaction{
		public $TranID;
		public $TranNo;
		public $TranDate;
		public $TranType;
		public $AccountId;
		public $UserID;
		public $TenantID;
		public $SubTotal;
		public $Tax;
		public $Discount;
		public $Total;
		public $Items;
		public $TaxDetails;
		public $Balance;
		public $Complete;
	}
	
	class TranactionItems{
		public $ItemRefID;
		public $ItemType;
		public $Description;
		public $UnitPrice;
		public $UOM;
		public $Qty;
		public $Subtotal;
		public $Discount;
		public $Tax;
		public $TotalPrice;
		public $TaxDetails;
	}

	class AccountBalance{
		public $AccountID;
		public $Balance;
	}

	class TransactionService{
		public function addTranaction($tran){
			$setoffItems=array();
			$authData = json_decode($_COOKIE["authData"]);
			$clientacc = ObjectStoreClient::WithNamespace("cloudcharge.duoworld.com","account",$authData->SecurityToken);
			$client = ObjectStoreClient::WithNamespace("cloudcharge.duoworld.com","cloudtransactions",$authData->SecurityToken);
			$client2=ObjectStoreClient::WithNamespace($authData->Domain,"cloudtransactions",$authData->SecurityToken);
			$s=$clientacc->get()->byKey($tran->AccountId);
			//var_dump($tran);
			//echo $tran->AccountId;
			if(!isset($s->AccountId)){
				echo '{"Error":true,"Message":"Error Account Not found"}';
				return;
			}
			if($s->UserID!=$authData->UserID){
				echo '{"Error":true,"Message":"Security Breach You are not Authorized."}';
				return;
			}
			$t=$client2->get()->byKey($tran->TranID);
			if(isset($t->TranID)){
				echo '{"Error":true,"Message":"Transactions Could not be modified."}';
				return;
			}
			$tran->TranID=getGUID();
			$tran->TranNo="-999";
			$tran->TranDate=date("Y-m-d")."T".date("H:i:s");
			$tran->TenantID=$authData->Domain;
			$tran->UserID=$authData->UserID;
			switch ($tran->TranType){
				case "invoice":
					// Invoice set off from advance can be done
					//$tran->
				break;
				case "receipt":
					$amount=0;
					//var_dump($tran);
					foreach ($tran->Items as $Item) {
						
						if($Item["TotalPrice"]>0){
							echo '{"Error":true,"Message":"Error setting off item '.$Item["ItemRefID"].' amount should be <0."}';
							return;
						}
						$x= $Item["ItemRefID"];
    					$value = $client2->get()->byKey($x);
						//var_dump($value->TranID);
						//echo($item["ItemRefID"]);
						
						if(!isset($value->TranID)){
							echo '{"Error":true,"Message":"Error setting off item '.$Item["ItemRefID"].'."}';
							return;	
						}
						//echo ($Item["TotalPrice"]);
						$value->Balance=$value->Balance+$Item["TotalPrice"];
				
						if($value->Balance<0){
							echo '{"Error":true,"Message":"Error setting off item '.$Item["ItemRefID"].' overflow exception '.$value->Balance.'"}';
							return;
						}
						
						if($value->Balance==0){
							$value->Complete="Y";
						}
						array_push($setoffItems,$value);
						$amount+=$Item["TotalPrice"];
						
					}
					
					$tran->Balance=$tran->Total-$amount;
					if($tran->Balance==0){
						$tran->Complete="Y";
					}
						
				break;
				default:
					echo '{"Error":true,"Message":"Transaction Type is not supported."}';
					return;
				break;
				
			}
			$x=$client->store()->byKeyField("TranNo")->andStore($tran);
			if($x->IsSuccess){
				//var_dump($x->Data[0]->ID);
				$tran->TranNo=$x->Data[0]->ID;
				$client2->store()->byKeyField("TranID")->andStore($tran);
				foreach($setoffItems as $item){
					$client->store()->byKeyField("TranNo")->andStore($item);
					$client2->store()->byKeyField("TranID")->andStore($item);
				}
				return $tran;
			}else{
				echo '{"Error":true,"Message":"Error Processing Tranaction"}';
				exit();
			}
			//$client->store()->byKeyField("TranID")->andStore($tran);
			
		}
		
		public function addTranfromservice(){
			$tran = new Trasaction();
			
            DuoWorldCommon::mapToObject(Flight::request()->data->getData(),$tran);
			json_encode($this->addTranaction($tran));
		}
		
		public function addInvoice($accID){
			$items=json_decode(Flight::request()->getBody());
			$authData = json_decode($_COOKIE["authData"]);
			$tran = new Trasaction();
			$tran->TranID=getGUID();
			$tran->TranDate=date("Y-m-d")."T".date("H:i:s");
			$tran->TranType="invoice";
			//echo $accID;
			$tran->AccountId=$accID;
			$tran->UserID=$authData->UserID;
			$tran->TenantID=$authData->Domain;
			$tran->Items=$items;
			$subtotal=0;
			$dicount=0;
			$tax=0;
			$total=0;
			foreach($items as $item){
				$subtotal+=$item->Subtotal;
				$dicount+=$item->Discount;
				$tax+=$item->Tax;
				$total+=$item->TotalPrice;
			}
			$tran->SubTotal=$subtotal;
			$tran->Tax=$tax;
			$tran->Discount=$dicount;
			$tran->Total=$total;
			$tran->Balance=$total;
			$tran->Complete='N';
			echo json_encode($this->addTranaction($tran));
		}
		
		
		
		public function AppPayments(){
			require ("bulktransfer.php");
			$items=json_decode(Flight::request()->getBody());
			$authData = json_decode($_COOKIE["authData"]);
			$tran = new Trasaction();
			$tran->TranID=getGUID();
			$tran->TranDate=date("Y-m-d")."T".date("H:i:s");
			$tran->TranType="invoice";
			//echo $accID;
			$tran->AccountId=$items->AccountId;
			$card=$items->Cards;
			$tran->UserID=$authData->UserID;
			$tran->TenantID=$authData->Domain;
			$tran->Items=$items->Items;
			$subtotal=0;
			$dicount=0;
			$tax=0;
			$total=0;
			foreach($items->Items as $item){
				$subtotal+=$item->Subtotal;
				$dicount+=$item->Discount;
				$tax+=$item->Tax;
				$total+=$item->TotalPrice;
				
			}
			
			
			$tran->SubTotal=$subtotal;
			$tran->Tax=$tax;
			$tran->Discount=$dicount;
			$tran->Total=$total;
			$tran->Balance=$total;
			$tran->Complete='N';
			$tranID="";
			if($tran->Total>0){
				$c=$this->strippay($items->Cards,$authData,$tran);
				
				//return;
				if($c["status"]!="succeeded"){
					echo '{"Error":true,"Message":"'.'Payment cannot be processed'.'"}';
					return;
				}
				$tarnID=$c["id"];
			}
			$t=$this->addTranaction($tran);
			$this->payInvoice($t->TranID,$t->Total,$tranID);
			$this->CreateSubscription($items->Items,$t->TranID,$t->AccountId,$authData->Domain,true,$tranID,$authData);
		}
		
		public function CreateSubscription($items,$tranID,$accountID,$TenantID,$payed,$payToken,$authData){
			$subscriptions=array();
			$client = ObjectStoreClient::WithNamespace("cloudcharge.duoworld.com","cloudsubscription",$authData->SecurityToken);
			$client2=ObjectStoreClient::WithNamespace($authData->Domain,"cloudsubscription",$authData->SecurityToken);
			
			$installer = new AppInstaller();
			foreach($items as $item){
				$i=$item;
				if($item->ItemType=="App"){
					$appCode = $item->ItemRefID;
					$installer->Install($appCode, $_SERVER['HTTP_HOST']);
					
					/*
					$obj = new BulkHeader();
					$obj->src = "duoworld.duoweb.info";
					$obj->dest = (strpos($_SERVER['HTTP_HOST'], "localhost") !== false) ? "localhost" : $_SERVER['HTTP_HOST'];

					$obj->addDetailId("application", $appCode, "ApplicationID");
					$obj->addDetailId("appdescriptor", $appCode, "appKey");
					$obj->addDetailFilter("appresources", "appCode: " . $appCode, "id");
					$transferObject = new BulkTransfer();
					$transferObject->Transfer($obj);
					*/
				}
				/**/
				$i->AccountId=$accountID;
				$i->SubscriptionID=getGUID();
				$i->SubscriptionDate=date("Y-m-d")."T".date("H:i:s");
				$i->Status="Active";
				$i->TranID=$tranID;
				$i->TenantID=$TenantID;
				$i->BillQty=0;
				$i->Billed="N";
				$i->PayID="";
				if($payed){
					$i->BillQty=$item->Qty;
					$i->Billed="Y";
					$i->PayID=$payToken;
				}
				$client->store()->byKeyField("SubscriptionID")->andStore($i);
				$client2->store()->byKeyField("SubscriptionID")->andStore($i);
				array_push($subscriptions,$i);
			}
			
		}
		
		public function getSubscriptions($accid){
			$authData = json_decode($_COOKIE["authData"]);
			$items =array();
			//var_dump($authData);
			
			$client = ObjectStoreClient::WithNamespace($authData->Domain,"cloudsubscription",$authData->SecurityToken);
			//$s=$client->get()->bySearching("AccountId:". $accid);
			$s=$client->get()->byFiltering("select * from cloudsubscription where AccountId='". $accid. "'");
			//$s=$client->get()->bySearching("AccountId:". $accid);
			//var_dump("select * from coudsubscription where AccountId='". $accid. "' and Billed='N'");
			echo json_encode($s);
		}
		
		public function strippay($card,$auth,$tran){
			try {
				require_once('./lib/Stripe.php');
                Stripe::setApiKey(STRIPE_KEY);
				//var_dump($card->CardNo);
				//exit();
                $result = Stripe_Token::create(
                    array(
                        "card" => array(
                            "name" => $auth->Name,
                            "number" => $card->CardNo,
                            "exp_month" => $card->ExpiryMonth,
                            "exp_year" => $card->ExpiryYear,
                            "cvc" => $card->CSV
                        )
                    )
                );

                $token = $result['id'];
				//var_dump($result);
				//exit();
                $charge = Stripe_Charge::create(array(
                      "amount" => $tran->Total*100,
                      "currency" => "usd",
                      "card" => $token,
                      "description" => "Charge for test@example.com" 
                ));
				return $charge;
			}catch (Exception $e) {
				echo '{"Error":true,"Message":"'.$e->getMessage().'"}';
				exit();
  			}
		}
		
		public function payInvoice($invID,$amount,$tranID){
			if($amount>0){
				$amount=-1*$amount;
			}
			$authData = json_decode($_COOKIE["authData"]);
			$client2=ObjectStoreClient::WithNamespace($authData->Domain,"cloudtransactions",$authData->SecurityToken);
			$t=$client2->get()->byKey($invID);
			if(!isset($t->TranID)){
				echo '{"Error":true,"Message":"Invoice Not Found."}';
				return;
			}
			if($t->UserID!=$authData->UserID){
				echo '{"Error":true,"Message":"Security Breach trying to pay from unknown sorce."}';
				return;
			}
			$tran = new Trasaction();
			$tran->TranID=getGUID();
			$tran->TranDate=date("Y-m-d")."T".date("H:i:s");
			$tran->TranType="receipt";
			//echo $accID;
			$tran->AccountId=$t->AccountId;
			$tran->UserID=$authData->UserID;
			$tran->TenantID=$authData->Domain;
			$tran->Items=array(array("ItemRefID"=>$t->TranID,
			"ItemNo"=>$t->TranNo,
			"ItemType"=>"invoice",
			"Description"=>"Pay Invoice by online payment ".$tranID,
			"UnitPrice"=>$amount,
			"UOM"=>"Amount",
			"Qty"=>1,
			"Subtotal"=>$amount,
			"Discount"=>0,
			"Tax"=>0,
			"TotalPrice"=>$amount,
			"TaxDetails"=>null));;
			$subtotal=0;
			$dicount=0;
			$tax=0;
			$total=0;
			
			$tran->SubTotal=$amount;
			$tran->Tax=0;
			$tran->Discount=0;
			$tran->Total=$amount;
			echo json_encode($this->addTranaction($tran));
		}
		
		
		public function getTransactions($accid){
			$authData = json_decode($_COOKIE["authData"]);
			$items =array();
			//var_dump($authData);
			
			$client = ObjectStoreClient::WithNamespace($authData->Domain,"cloudtransactions",$authData->SecurityToken);
			$s=$client->get()->bySearching("AccountId:". $accid);
			foreach($s as $item){
				
				$f=array("TranID"=>"********".substr($item["TranID"],-4),
						 "UncecoredTranID"=>$item["TranID"],
										"TranNo"=>$item["TranNo"],
										"TranType"=>$item["TranType"],
										"TranDate"=>$item["TranDate"],
						 				"Description"=>$item["Items"],
										"Amount"=>$item["Total"],
										"Balance"=>$item["Balance"]);
				array_push($items,$f);
			}
			echo(json_encode($items));
		}
		
		public function getTransactionsByID($tid){
			$authData = json_decode($_COOKIE["authData"]);
			$items =array();
			//var_dump($authData);
			
			$client = ObjectStoreClient::WithNamespace($authData->Domain,"cloudtransactions",$authData->SecurityToken);
			$s=$client->get()->byKey($tid);
			
			echo(json_encode($s));
		}
		
		
		
		public function getTrantemplete(){
			$tran = new Trasaction();
			$tran->TranID=getGUID();
			$tran->TranDate=date("Y-m-d")."T".date("H:i:s");
			$taxDetails=array(array("TaxID"=>"","TaxPercentage"=>0.2,"Amout"=>0,"TaxAmout"=>0,"Total"=>0));
			$itemdetails =array(array("ItemRefID"=>"",
			"ItemType"=>"",
			"Description"=>"",
			"UnitPrice"=>"",
			"UOM"=>"",
			"Qty"=>0,
			"Subtotal"=>0,
			"Discount"=>0,
			"Tax"=>0,
			"TotalPrice"=>0,
			"TaxDetails"=>$taxDetails));
			$tran->Items=$itemdetails;
			$tran->TaxDetails=$taxDetails;
			echo json_encode($tran);
		}
		
		function __construct(){
			Flight::route("POST /transaction", function (){ $this->addTranfromservice();});
			Flight::route("POST /transaction/addInvoice/@accID", function ($accID){ $this->addInvoice($accID);});
			Flight::route("POST /transaction/paystrip", function (){ $this->AppPayments();});
			Flight::route("GET /transaction/payInvoice/@invID/@amount/@tranID", function ($invID,$amount,$tranID){ $this->payInvoice($invID,$amount,$tranID);});
			Flight::route("GET /transaction/getTempelete", function (){ $this->getTrantemplete();});
			Flight::route("GET /transaction/getbyID/@tid", function ($tid){ $this->getTransactions($tid);});
			Flight::route("GET /transaction/get/@accid", function ($accid){ $this->getTransactions($accid);});
			Flight::route("GET /transaction/subscription/@accid", function ($accid){ $this->getSubscriptions($accid);});
		}
	}
?>
