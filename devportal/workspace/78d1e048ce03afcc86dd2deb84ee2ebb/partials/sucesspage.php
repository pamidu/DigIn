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
      <h2>{{status}}</h2>
      <span flex></span>
      <md-button class="md-icon-button" ng-click="cancel()">
        <md-icon md-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog"></md-icon>
      </md-button>
    </div>
  </md-toolbar>
	<md-content class="md-padding" ng-if="status == 'Success'">
		<div layout="row" layout-align="start start">
			<image src="img/checked.png" flex="10">
			<div style="padding-top:12px;margin-left:10px" flex>
				Your application has been successfully Installed.
			</div>
		</div>
		<div layout="row" layout-align="start start" style="margin-top:40px;">
			<div flex>
			Transaction ID: {{result.TranID}}
			</div>
		</div>
		<div layout="row" layout-align="start start">
			<div flex>
			Transaction Date: {{result.TranDate}}
			</div>
		</div>
		<div layout="row" layout-align="start start">
			<div flex style="font-weight:700">
			<h3>Total Price Charged: <span style="color:#388E3C">${{result.Total}}</span></h3>
			</div>
		</div>
		
	</md-content>
	
	<md-content class="md-padding" ng-if="status == 'Error'">
		<div layout="row" layout-align="start start">
			<image src="img/error.png" flex="10"/>
			
			<div style="padding-top:5px;margin-left:10px" flex>
				This application failed to install.
			</div>
			
			
		</div>
		
		<div layout="row" layout-align="start start" style="margin-top:40px;">
			<div style="width:400px">{{Message}}</div>
		</div>
		
	</md-content>
      
  <md-divider></md-divider>
  <div class="md-actions" layout="row">
	<div layout="column" layout-align="start start">
		
		 <div layout="row">
			<span style="font-size: 12px;margin-top:5px;margin-left:15px;">Powered by Cloud Charge</span>
		</div>
	 </div>
	 
	
    <span flex></span>
	
    <md-button type="submit" ng-click="ok()" class="md-raised md-primary" style="margin-right:20px;" >
      ok
    </md-button>
  </div>
</md-dialog>