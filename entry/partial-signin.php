<div class="digin-lgn-wrap"  ng-controller="signin-ctrl">
    <toast></toast>
    <div class="auth-message-wrap"
         ng-if="error.isLoading">

    </div>


    <!-- Update UI login form -->
    <div layout="column" layout-align="center center">
        <div class="digin-login-card animated flipInX">
            <div layout="row" layout-xs="column">
                <div flex="45">
                    <div class="left-main-wrap">
                        <div class="left-wrap sign-in">
                            <ul class="bg-bubbles">
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                            <div class="login-logo ">
                                <img class="animate-circle" src="image/login-logo.png">
                            </div>
                            <span class="login-welcome">
                                Welcome
                            </span>
                            <h5>
                                DigIn - Beyond BI
                            </h5>

                            <div class="welcome-link sign-up-link"
                                 ng-click="onClickSignUp()">
                                <a href="javascript:void(0)">Sign up now</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div flex="55">
                    <div class="right-wrap">
                        <div class="header-login">
                            <div class="login-text-wrap pull-right ">
                               <h5 id="sliderRight">Sign In</h5>
                            </div>
                        </div>

                        <form name="frmDiginLogin" autocomplete="off" ng-submit="login()">             
                            <div class="login-bdy">
                                <div class="text-wrap ">
                                    <div>

                                        <div style="padding: 6px;background:#5ac55f;border-radius: 3px; align:center;" ng-show={{activated}}> 
                                           <!--span style="padding-left: 0px;color:white;font-weight:700;font-size: 15px; margin: 0px; align:center;">{{activatedemail}}</span>
                                           </br-->
                                           <span style="padding-left: 0px;color:white;font-weight:700;font-size: 15px; margin: 0px; align:center;">Your account is activated.</span>
                                           <img src="image/check.png" style="width:30px;height:30px;">
                                        </div>
                                        </br>
                                        <div class="txt-box-login"
                                             ng-class="{error:error.isUserName,'':!error.isUserName}">
                                            <label>User name</label>
                                            <div>
                                                <input type="text"
                                                       required
                                                       id="txtUname"
                                                       name="loginUserName"
                                                       ng-model="signindetails.Username"
                                                       placeholder="username@digin.io"

                                                       class="form-control">
                                            </div>
                                            <div  ng-show="frmDiginLogin.loginUserName.$invalid && !frmDiginLogin.loginUserName.$pristine"
                                             class="ng-message" ng-messages="frmDiginLogin.loginUserName.$error">
                                                <div ng-message="required">User name is required.</div>
                                            </div>
                                        </div>
                                        <div class="txt-box-login password"
                                             ng-class="{error:error.isPwd,'':!error.isPwd}">
                                            <label>Password</label>
                                            <div>
                                                <input type="password"
                                                       name="password"
                                                       id="password"

                                                       required
                                                       ng-model="signindetails.Password"
                                                       placeholder="***************"
                                                       class="form-control">
                                            </div>
                                            <div ng-show="frmDiginLogin.password.$invalid && !frmDiginLogin.password.$pristine"
                                            class="ng-message" ng-messages="frmDiginLogin.password.$error">
                                                <div ng-message="required">Password is required.</div>
                                            </div>
                                        </div>

                                       <!--  <div class="login-help">
                                            <div class="forget-pwd">
                                                <a href="#" onclick="javascript:onClickForgetPw()">Forgot Password?</a>
                                            </div>
                                        </div>
                                        -->

                                        <div class="login-help">
                                            <a href="javascript:void(0)" ng-click="onClickForgetPw()">Forgot Password?</a>
                                        </div>


                                    </div>
                                </div>

                                <div class="login-loading" ng-if="error.isLoading">
                                    <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
                                    <span class="sr-only">Loading...</span>
                                </div>
                                </br>
                                <div class="login-btn-wrap" ng-if="!error.isLoading">
                                    <a href="javascript:void(0  )"
                                       ng-click="login()"
                                       ng-class="{disable:frmDiginLogin.$invalid,activeBtn: !frmDiginLogin.$invalid}"
                                       class="login-btn">
                                        Login
                                    </a>
                                </div>

                                <input type="submit" style="position: absolute; left: -9999px; width: 1px; height: 1px;"/>

                            </div>
                        </form>



                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer-wrap">
        Copyright 2016 digin.io - All Rights Reserved
    </div>


    <!-- end new UI -->


    <!--<div layout="column" layout-align="center center">-->
    <!--<div class="digin-login-card">-->
    <!--<div layout="row" layout="row">-->
    <!--<div flex>-->
    <!--<div class="right-wrap">-->
    <!--<div class="header-login">-->
    <!--<div class="login-text-wrap text-center ">-->
    <!--<img ng-src="styles/css/images/initiallog.png" style="width:140px;" height="90px">-->
    <!--</div>-->
    <!--</div>-->
    <!--<form name="frmDiginLogin" autocomplete="off">-->
    <!--<div class="login-bdy">-->
    <!--<div class="text-wrap ">-->
    <!--<div>-->
    <!--<div class="txt-box-login"-->
    <!--ng-class="{error:error.isUserName,'':!error.isUserName}">-->
    <!--<div>-->
    <!--<md-input-container class="md-block p-b-0 p-t-15" flex-gt-sm>-->
    <!--<label>Email</label>-->
    <!--<input type="text"-->
    <!--required-->
    <!--id="txtUname"-->
    <!--name="loginUserName"-->
    <!--ng-model="txtUname"-->
    <!--placeholder="username@duoworld.com"-->
    <!--class="form-control">-->
    <!--</md-input-container>-->
    <!--</div>-->
    <!--<div class="ng-message" ng-messages="frmDiginLogin.loginUserName.$error">-->
    <!--<div ng-message="required">required.</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="txt-box-login password"-->
    <!--ng-class="{error:error.isPwd,'':!error.isPwd}">-->
    <!--<div>-->
    <!--<md-input-container class="md-block p-b-0" flex-gt-sm>-->
    <!--<label>Password</label>-->
    <!--<input type="password"-->
    <!--name="password"-->
    <!--id="password"-->
    <!--required-->
    <!--ng-model="txtPwd"-->
    <!--placeholder="***************"-->
    <!--class="form-control">-->
    <!--</md-input-container>-->
    <!--</div>-->
    <!--<div class="ng-message" ng-messages="frmDiginLogin.password.$error">-->
    <!--<div ng-message="required">required.</div>-->
    <!--</div>-->
    <!--</div>-->

    <!--<div class="login-help p-t-20">-->
    <!--<div class="remember-me">-->
    <!--<md-checkbox  aria-label="Checkbox 1">-->
    <!--Remember me-->
    <!--</md-checkbox>-->

    <!--</div>-->
    <!--<div class="forget-pwd">-->
    <!--Forgot password?-->
    <!--</div>-->

    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="login-btn-wrap">-->
    <!--<a href="javascript:void(0  )"-->
    <!--ng-click="login()"-->
    <!--ng-class="{disable:frmDiginLogin.$invalid,activeBtn: !frmDiginLogin.$invalid}"-->
    <!--class="md-raised md-primary md-button md-ink-ripple text-color-white flex">-->
    <!--Login-->
    <!--</a>-->
    <!--<a href="javascript:void(0  )"-->
    <!--ng-click="onClickSignUp()"-->
    <!--class="md-raised md-primary md-button md-ink-ripple text-color-white flex">-->
    <!--Sign Up-->
    <!--</a>-->
    <!--</div>-->
    <!--</div>-->
    <!--</form>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->

    <!--<div class="footer-wrap">-->
    <!--copyright 2016 digin.io - All Rights Reserved-->
    <!--</div>-->

</div>