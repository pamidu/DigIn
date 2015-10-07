<?php 
    session_start();
    include ("config.php");
    include ("session.php");
    $error='';
    //var_dump($_COOKIE['securityToken']);
    if (isset($_GET["r"])){
        
        $_SESSION['r']=$_GET["r"];
    }

    if(isset($_COOKIE['securityToken']))
    {
        if(isset($_SESSION['r']))
        {
            header("Location: ".$_SESSION['r']."?securityToken=".$_COOKIE["securityToken"]);
            session_unset('r');
            exit();
        }
        else
        {
            // header("location: /");  
            // exit();
        }

    }

    if (isset($_POST['userName']) && isset($_POST['password'])) {
        if (empty($_POST['userName']) || empty($_POST['password'])) {
            $error = "Username or Password is invalid";
        }       
        else
        {
            $username=$_POST['userName'];
            $password=$_POST['password'];
            $fullhost=strtolower($_SERVER['HTTP_HOST']);
            $baseUrl=$authURI."Login/".$username."/".$password."/".$fullhost;
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $baseUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            $data=curl_exec($ch);
            $authObject = json_decode($data);
            curl_close($ch);
            
            if(isset($authObject))
            {   
                if(isset($authObject->SecurityToken)){
                    setcookie('securityToken',$authObject->SecurityToken);
                    setcookie('authData',json_encode($authObject));
                    $_SESSION['securityToken']=$authObject->SecurityToken;
                    $_SESSION['userObject']=$authObject;
                    //echo "sss";
                    //var_dump($_COOKIE['securityToken']);
                    //var_dump($_SESSION['securityToken']);
                    //exit();
                    if(isset($_SESSION['r']))
                    {
                        header("Location: ".$_SESSION['r']."?securityToken=".$_SESSION["securityToken"]);
                        session_unset('r');

                        exit();
                    }
                    else
                    {
                        header("location: home.html");  
                    }
                }
            }
            else{
                echo "User name or Password is incorrect";
            }       
        }
    }else
    { 
//      echo "TEST";
    }

?>

<!DOCTYPE html>
    <html ng-app="diginLogin" ng-controller="LoginCtrl">

    <head>
        <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="stylesheet" href="bower_components/angular-material/angular-material.css">
        <link rel="stylesheet" href="http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
        <link rel="stylesheet" href="styles/css/commonstyle.css">
    </head>
    <body ng-cloak style="background-color:white;">
        <div id="gradient" style="height:50vh;" />

        <div id="viewContainer" layout="column" layout-align="center center">
            <md-card id="loginFrame" class="md-whiteframe-z4" layout="column" layout-align="start center" style="min-width:525px;background-color:#fafafa;">
                <div layout="row" layout-align="center center" style="padding:10px;">
                    <img ng-src="styles/css/images/initiallog.png" style="width:100px;" height="60px">
                </div>

                <form name="loginForm" style="padding:10px 36px;width:100%;" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="POST" flex>
                    <div layout="row">
                        <ng-md-icon icon="account_circle" style="fill: darkgrey;
    padding: 25px 10px;"></ng-md-icon>
                        <md-input-container flex>
                            <label>User Name</label>
                            <input required id="userName" name="userName" model="txtUname">
                            <!-- <div ng-messages="loginForm.userName.$error">
                <div ng-message="required">This is required.</div>
            </div> -->
                        </md-input-container>
                    </div>
                    <div layout="row">
                        <ng-md-icon icon="vpn_key" style="fill: darkgrey;
    padding: 25px 10px;"></ng-md-icon>
                        <md-input-container flex>
                            <label>Password</label>
                            <input type="password" required id="password" name="password" model="txtPwd">
                            <!-- <div ng-messages="loginForm.password.$error">
            <div ng-message="required">This is required.</div>
        </div> -->
                        </md-input-container>
                    </div>
                    <p style="font-size:small;color:darkgrey;">New to Duodigin? <a href="http://duoworld.sossgrid.com/signup/">Signup</a></p>

                <md-button class="md-fab  md-primary" type="submit" style="top: 50%;
    margin-top: -25px;
    position: absolute;
    margin-left: 462px;">
                    <md-icon class="ion-android-arrow-forward" style="fill: darkgrey;margin-bottom:30px;font-size:30px;"></md-icon>
                </md-button>
                </form>
            </md-card>
            
            <div id="companyCygilScroll" class=""></div>
        </div>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.6/angular.js"></script>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.3/angular-route.js"></script>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.13/angular-messages.min.js"></script>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.15.0/TweenMax.min.js"></script>
        <script src="bower_components/angular-material/angular-material.js"></script>
        <script src="bower_components/angular-animate/angular-animate.js"></script>
        <script src="bower_components/angular-aria/angular-aria.js"></script>
        <script src="bower_components/hammerjs/hammer.js"></script>
        <script src="bower_components/ngStorage/ngStorage.js"></script>
        <script src="scripts/vendor/uimicrokernel.js"></script>
        <!--ng-md-icon script-->
        <script src="//cdnjs.cloudflare.com/ajax/libs/angular-material-icons/0.6.0/angular-material-icons.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/SVG-Morpheus/0.1.8/svg-morpheus.js"></script>

        <script type="text/javascript" src="scripts/controllers/login.js"></script>
        <script type="text/javascript" src="scripts/loginBackground.js"></script>
    </body>

    </html>
