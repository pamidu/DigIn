<div  style="width:100%;height:100%; align:center; margin: 0 auto;" ng-controller="signup-ctrl">
	
		<body bgcolor="#FFFFFF">
			
			<div layout=row>
				<!-- <img src="image/login-logo.png" style="width:50px;height:50px; "> -->
				<div style="background-color: #01718d; width:5%;">

                </div>	
				<div aligh=center style="width:5%; padding-left:2px; padding-top:2px;" >
                	<img src="image/login-logo.png" style="width:50px;height:50px; ">
                </div>

				<div style="padding: 6px; height: 20%; border-bottom: 1px solid #EEE; background-color: #01718d; width:90%;">
					<span style="padding-left:10px; color:white;font-weight:5000;font-size: 40px; font-family: 'Goudy Old Style';">
						Terms and Conditions
					</span></div>	
				</div>								
			</br>

			<div align="center">
				<span style="padding-left: 0px;font-weight:500;font-size: 15px; align:center;  font-family: 'Bookman Old Style';">
						<b>Thank you</b> for your interest in DigIn!
						
				</span>
				<span style="padding-left: 0px;font-weight:300;font-size: 15px; align:center;  ">
				<p>Please read the terms and conditions below and if you accept these terms and conditions, please click the "I agreed" button below,</p></span>
			</div>

			

			<div align="center" style="padding:4px; height: 70%;">
				<textarea rows="23" cols="175" style="border: 5px solid #cccccc;font-family: Tahoma; resize: none; padding: 20px 20px; text-align: justify; " readonly="true" >	
					<?php include('agreement.php');?>
				</textarea>
			</div>

			

			<div align="center">
			    <md-button ng-click="clickAgreed()" class="md-raised md-primary">I AGREED</md-button>
			    <md-button ng-click="clickNotAgreed()" class="md-raised md-primary">I DO NOT AGREED</md-button>
			</div>

			</br>

		    <div align="center" style="padding: 10px; height: 10%; width:100%; background-color: #01718d; ">
				<span style="color:white;font-weight:500;font-size: 13px; ">
					Copyright 2016 digin.io - All Rights Reserved
				</span>
			</div>	


		</body>
</div>
