<style>
input,select,textarea{
    border: none;
    border-bottom: 1px solid #e1e1e1;
	margin-top: 8px;
	}
	*:focus{
		outline: 0;
	}
	select:focus,input:focus, textarea:focus{
		border-bottom: 2px solid #3f51b5;
	}
	.label
	{
		font-size: 15px;
	}
	.selected {
  background-color: #E8E8E8;
  box-shadow:0 5px 5px -3px rgba(0,0,0,.14),0 8px 10px 1px rgba(0,0,0,.098),0 3px 14px 2px rgba(0,0,0,.084);
}
</style>
<md-dialog aria-label="Mango (Fruit)">
  <md-toolbar class="modal-header">
    <div class="md-toolbar-tools">
      <h2>My Cards</h2>
      <span flex></span>
      <md-button class="md-icon-button" ng-click="cancel()">
        <md-icon md-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog"></md-icon>
      </md-button>
    </div>
  </md-toolbar>

      <form id="paymentInfoForm" name="paymentInfoForm"  method="post" novalidate>
	    <md-dialog-content style="max-width:800px;max-height:910px;">
			<h2>Please select card</h2>
			<center id="inline" >
			
					<li ng-repeat="account in accounts[0].AccountCards" > 
						<md-card style="width:230px;cursor:pointer;" id="cardApp" ng-click="selectAccount($index, account)" ng-class="{selected: $index == selectedCard}">
							<img ng-src="img/card1.png" class="md-card-image" style="background:#E3F2FF" alt="Washed Out">
							<md-card-content style="padding:0px;padding-left:5px;height: 80px;">
								<h1 class="md-title">{{account.Name}}</h1>
								<text>{{account.CardNo | hideNumbers}}</text>
							</md-card-content>
						</md-card>
					</li> 
			</center>
			<div layout="row" layout-align="space-between center" ng-if="selectedAccount.Name">
					
			<md-checkbox flex
                    ng-model="agree"
                    aria-label="Checkbox 2"
                    ng-true-value="'yup'"
                    ng-false-value="'nope'"
                    class="md-warn md-align-top-left"
					ng-change="change()">
                <span class="ipsum">
                    I agree and I am willing to associate my account registration with the <a href=""> Duo Cloud Charge agreement</a>.
                </span>
                </md-checkbox>
	
			</div>
			<div layout="row" layout-align="space-between center" ng-if="selectedAccount.Name">
				
					<text style="padding-top:20px;padding-bottom:6px;margin-right:10px;color:green;font-weight:700" flex>Pay with {{selectedAccount.Name}}</text>
			</div>
		</md-dialog-content>
      </form>
  <md-divider></md-divider>
  <div class="md-actions" layout="row">
	<div layout="column" layout-align="start start">
		<div layout="row">
			<a style="color:blue;margin-top:10px;cursor: pointer;" ng-click="showaddcardPopup(account,$event)">Add New Card</a>
		 </div>
		 <div layout="row">
			<span style="font-size: 12px;margin-top:5px">Powered by Cloud Charge</span>
		</div>
	 </div>
	 
	
    <span flex></span>
	
    <md-button ng-click="answer('not useful')" >
     cancel
    </md-button>
    <md-button type="submit" ng-click="payinfoSubmit()" class="md-raised md-primary" ng-disabled="disablePayment" style="margin-right:20px;" >
      Make Payment
    </md-button>
  </div>
  
  <!--div layout="row">

		<div layout="row">
			<md-progress-circular md-mode="indeterminate" md-diameter="96"></md-progress-circular>
		</div>


  </div-->
</md-dialog>