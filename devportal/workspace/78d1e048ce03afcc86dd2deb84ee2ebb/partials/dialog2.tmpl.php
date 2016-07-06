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
</style>
<md-dialog aria-label="Mango (Fruit)">
  <md-toolbar class="modal-header">
    <div class="md-toolbar-tools">
      <h2>Create New Card</h2>
      <span flex></span>
      <md-button class="md-icon-button" ng-click="cancel()">
        <md-icon md-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog"></md-icon>
      </md-button>
    </div>
  </md-toolbar>

      <form id="paymentInfoForm" name="paymentInfoForm" action="partials/payment.php" method="post" novalidate>
	    <md-dialog-content style="max-width:800px;max-height:910px;">
			<div layout="row" layout-sm="column">
				<div flex="45">
				<label class="label">Name</label>
				<input type="text" name="name" ng-model="payment.Name" style="width: 360px;" required> 
				</div>
				<div flex="10"></div>
				<div flex="45">
				<label class="label">Card Number</label>
				<input type="text" name="cardnum" ng-model="payment.CardNo" style="width: 350px;" required>
				</div>
			</div>
			<div layout="row" layout-sm="column" style="margin-top:20px">
				<!--div flex="45">
				<label class="label">Country</label>
				 <md-select name="myModel" ng-model="payment.country" required>
                            <md-option ng-value="country" value="country" ng-repeat="country in countries">{{country.name}}</md-option>
                 </md-select-->
				 <!--select ng-model="payment.country" style="width:360px">
					  <option ng-value="country" ng-repeat="country in countries">{{country.name}}</option>
				  </select-->
				  <div flex="45">
				<label>Billing Address</label>
				<textarea name="addr" ng-model="payment.BillingAddress" style="width: 350px;" required></textarea>
				</div>
				  
				 
				 
				 <div flex="10"></div>
				 <div flex>
				  <label class="label">Month(MM)</label>
				<input type="text" name="exprmonth" ng-model="payment.ExpiryMonth" style="width: 110px;" required >
				</div>
				<div flex style="margin-left:5px">
				  <label class="label">Year(YY)</label>
				<input type="text" name="expryear" ng-model="payment.ExpiryYear" style="width: 110px;" required flex>
				</div>
				<div flex style="margin-left:5px">
					<label class="label">CVC</label>
					<input type="text" name="cvc" ng-model="payment.CSV" style="width: 110px;" flex>
				</div>
			</div>
			<div layout="row" layout-sm="column" style="margin-top:20px">
				<div flex="45">
				<label>Delivery Address</label>
				<textarea name="addr" ng-model="payment.DeliveyAddress" style="width: 350px;" required></textarea>
				</div>
				
				
			</div>
		
			<!--div layout="row" layout-sm="column" style="margin-top:20px" ng-if="payment.country">
				<div flex="45">
				<label>Stress Address</label>
				<textarea name="addr" ng-model="payment.addr1" style="width: 350px;" required></textarea>
				</div>
				<div flex="10"></div>
				<div flex="45">
				</div>
			</div-->
			<div layout="row" layout-sm="column" style="margin-top:20px" ng-if="payment.country">
				<div flex="20">
				<label>City</label>
				<input type="text" name="name" ng-model="payment.city" style="width:174px;" required>
				</div>
				<div flex="20" style="margin-left: 26px;">
				<label>Postal Code</label>
				<input type="text" name="name" ng-model="payment.postal" style="width:174px;" required>
				</div>
				
				
			</div>
			
			<!--div layout="row" layout-sm="column" style="margin-top:20px">
				 <md-checkbox flex
                            ng-model="data.cb1"
                            aria-label="Checkbox 2"
                            ng-true-value="'yup'"
                            ng-false-value="'nope'"
                            class="md-warn md-align-top-left">
                        <span class="ipsum">
                            Delivary information is same as billing information.
                        </span>
                        </md-checkbox>
						
			</div>
			
			<div layout="row" layout-sm="column">
			<md-checkbox
                    ng-model="data.cb2"
                    aria-label="Checkbox 2"
                    ng-true-value="'yup'"
                    ng-false-value="'nope'"
                    class="md-warn md-align-top-left">
                <span class="ipsum">
                    I agree and I am willing to associate my account registration with the <a href=""> Duo Cloud Charge agreement</a>.
                </span>
                </md-checkbox>
				</div-->
				</md-dialog-content>
      </form>
  <md-divider></md-divider>
  <div class="md-actions" layout="row">
	<div style="font-size: 12px;margin-top:30px">Powered by Cloud Charge</div>
    <span flex></span>
    <md-button ng-click="answer('not useful')" >
     cancel
    </md-button>
    <md-button type="submit" ng-click="payinfoSubmit(payment)" class="md-raised md-primary" style="margin-right:20px;" >
      Create
    </md-button>
  </div>
</md-dialog>