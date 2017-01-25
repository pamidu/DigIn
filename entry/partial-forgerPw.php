<div class="digin-lgn-wrap"  ng-controller="signin-ctrl">
    <toast></toast>
    <div class="auth-message-wrap"
         ng-if="error.isLoading">

    </div>


    <div layout="column" layout-align="center center">
        <div class="digin-login-card animated flipInX">
            <div layout="column">

                    <div class="right-wrap">
                        <div class="header-login">                                
                            <div class="login-text-wrap pull-center" >
                                 <!--<img ng-src="../shell/styles/css/images/DiginLogo.png"> -->
                                <h5> Forgot Password</h5>
                            </div>
                        </div>

                        <form name="frmDiginLogin" autocomplete="off">
                            <div class="login-bdy">
                                <div class="text-wrap">
                                        <div class="txt-box-login"
                                             ng-class="{error:error.isUserName,'':!error.isUserName}">
                                            <label>User Name</label>
                                                <input type="text"
                                                       required
                                                       id="txtUname"
                                                       name="loginUserName"
                                                       ng-model="email"
                                                       placeholder="username@digin.io"
                                                       class="form-control">
                                        </div>

                                </div>

                                <div class="login-loading" ng-if="error.isLoading">
                                    <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
                                    <span class="sr-only">Loading...</span>
                                </div>

                                <div layout="column" flex style="align:center">
                                    <div class="login-btn-wrap" ng-if="!error.isLoading">
                                        <a href="javascript:void(0  )"
                                           ng-click="onClickSignIn()" 
                                           ng-class="{disable:frmDiginLogin.$invalid,activeBtn: !frmDiginLogin.$invalid}"
                                           class="login-btn">
                                            GO BACK TO LOGIN
                                        </a>
                                    </div>
                                    <div class="login-btn-wrap" ng-if="!error.isLoading">
                                        <a href="javascript:void(0)"
                                           ng-click="validateEmail()"
                                           ng-class="{disable:frmDiginLogin.$invalid,activeBtn: !frmDiginLogin.$invalid}"
                                           class="login-btn">
                                            RESET PASSWORD
                                        </a>
                                    </div>
                                </div>
                                        
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