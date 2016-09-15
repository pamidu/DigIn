<style>
#password-strength-indicator {
    position: absolute;
    right: 0;
    top: 0px;
    width: 5px;
    padding: 0 10px;
    cursor:pointer;
}

#password-strength-indicator span {
    display: block;
    height: 5px;
    margin-bottom: 2px;
    width: 5px;
    border-radius: 5px;
    background: #EDF0F3
}
.has-feedback .form-control-feedback {
    top: 0;
    left: 0;
    width: 46px;
    height: 46px;
    line-height: 46px;
    color: #555
}
</style>


<div class="digin-lgn-wrap"  ng-controller="signin-ctrl">
    <toast></toast>
    <div class="auth-message-wrap" ng-if="error.isLoading"></div>


    <div layout="column" layout-align="center center">
        <div class="digin-login-card animated flipInX">
            <div layout="column">

                    <div class="right-wrap-password">
                        <div class="header-login">                                
                            <div class="login-text-wrap pull-center" >
                                <h5>Change Password</h5>
                            </div>
                        </div>

                        <form md-theme="default" name="editForm" ng-submit="editForm.$valid && submitPassword()">
                         
                            <div style="padding:30px">
                                 <md-input-container layout="column" class="md-block" flex-gt-sm>
                                    <label>New Password</label>
                                    <input required type="password" ng-model="newPassword" name="newpass" password-strength-indicator>
                                    <div ng-messages="editForm.newpass.$error">
                                        <div ng-message-exp="['required']">
                                            Please enter a new password
                                        </div>
                                    </div>
                                 </md-input-container>

                                 <md-input-container layout="column" class="md-block" flex-gt-sm>
                                    <label>Confirm New Password</label>
                                    <input required type="password" ng-model="confirmNewPassword" name="confrimpass">
                                    <div ng-messages="editForm.confrimpass.$error">
                                        <div ng-message-exp="['required']">
                                            Please confrim your new password
                                        </div>
                                    </div>
                                 </md-input-container>
                            </div>
                            
                            <div class="md-actions" layout="row">
                                    <span flex></span>
                                    <md-button class="btn-dialog b-r-0" aria-label="change" ng-click="onClickSignIn()">
                                        Back to Login
                                    </md-button>
                                    <md-button class="btn-dialog b-r-0" aria-label="change" type="submit">
                                        Change Password
                                    </md-button>
                            </div>
                              
                          </form>

                    </div>

            </div>
        </div>
    </div>

    <div class="footer-wrap">
        Copyright 2016 digin.io - All Rights Reserved
    </div>


</div>