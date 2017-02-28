<md-sidenav class="md-sidenav-right md-whiteframe-z2" md-component-id="notifications" style="overflow-y:hidden;z-index:1501;">

        <md-toolbar style="min-height: 45px;height:45px;">
            <div layout="row" layout-align="space-between center">

                <h1 class="md-toolbar-tools" style="color:white">Notifications</h1>
				<div layout="row">
					<i class="ti-volume" style="margin-top: 20px;margin-right: 8px;"> </i>
					<md-switch ng-model="notificationAudio" aria-label="Switch 1"></md-switch>
				</div>
            </div>
        </md-toolbar>
        <md-content style="overflow-y:scroll;height:calc(100% - 130px);padding:0" ng-if="notifications.length >= 1">
            <md-list style="padding:0">
                <md-list-item class="md-3-line" ng-repeat="notification in notifications" ng-click="viewNotifications(notification)">
                    <div class="md-list-item-text" layout="column">
                        <div layout="row" layout-align="start start" > <h3 style="width: 155px;">{{notification.title}}</h3></div>
                        <p style="margin-top:6px;">{{notification.description}}</p>
                    </div>
                    <md-button class="md-icon-button launch" ng-click="removeNotification($event,notification)" style="margin-top: 10px !important" aria-label="delete" ng-if="notification.email == useremail">
                        <ng-md-icon icon="close" style="fill:#979797" size="18px"></ng-md-icon>
                    </md-button>
                </md-list-item>
            </md-list>
        </md-content>
        <md-content style="padding:0;height:calc(100% - 130px)" ng-if="notifications.length < 1" layout="column" layout-align="center center">
            <p>There are no Notifications</p>
        </md-content>
        

</md-sidenav>

<md-sidenav class="md-sidenav-left md-whiteframe-z2" md-component-id="searchBar" style="overflow-y:hidden;z-index:1501;">


        <md-toolbar style="min-height: 45px;height:45px;">
            <div layout="row" layout-align="space-between center">

                <div class="search-box">
                    <input class="form-control txt-sm-search-header" placeholder="search dashboard or report..." ng-model="SearchText">
                </div>
				<!--md-button class="md-icon-button"  ng-click="openSearchBar()">
                    <ng-md-icon icon="close" style="fill:white;margin-top:10px" size="24px"></ng-md-icon>
                </md-button-->
            </div>
        </md-toolbar>
        <md-content style="overflow-y:scroll;height:calc(100% - 130px);padding:0">
			<div class="dashboard-wrapper">
				<h3 style="color: #9a9a9a;margin-left:10px">Dashboards</h3>
			</div>
			<div class="blut-dashboard-view"
				 ng-slimscroll
				 opacity="0.1"
				 distance="10px"
				 height="230px"
				 ng-mouseover="isSarchScorllBar = true"
				 ng-mouseleave="isSarchScorllBar = false"
				 enabled="{{ isSarchScorllBar }}">

              

				<ul class="dashboard-wrap" ng-repeat="dashboard in dashboards | filter : SearchText">
					{{x}} 
                   
                    <md-radio-group ng-model="data.defaultDashboard" ng-change="setDefaultDashboard($event,dashboard)">
                        <md-radio-button value="{{dashboard.dashboardID}}" class="md-primary" style="float: left;">
                            <md-tooltip md-direction="Bottom" style="z-index: 9999;">
                                  Set {{dashboard.dashboardName}} as default 
                            </md-tooltip>
                        </md-radio-button>
                    </md-radio-group>
					<li class="pull-left dashboard-name">{{dashboard.dashboardName}}</li>
					<li class="pull-right view-more-btn" ng-click="goDashboard(dashboard)">view</li>
					<li class="pull-right delete-btn" ng-click="deleteDashBoard(dashboard,$event)">delete</li>
				</ul>
			</div>

			 <div class="dashboard-wrapper">
				<h3 style="color: #9a9a9a;margin-left:10px">Reports</h3>
			</div>
			<div class="blut-dashboard-view"
				 ng-slimscroll
				 opacity="0.1"
				 distance="10px"
				 height="230px"
				 ng-mouseover="isSarchScorllBar = true"
				 ng-mouseleave="isSarchScorllBar = false"
				 enabled="{{ isSarchScorllBar }}">
				<ul class="dashboard-wrap" ng-repeat="report in reports | filter : SearchText">
					<li class="pull-left dashboard-name">{{report.splitName}}</li>
					<li class="pull-right view-more-btn" ng-click="goReport(report.splitName)">view</li>
				</ul>
			</div>
        </md-content>
        

    </md-sidenav>

<div class="digin-style" ng-init="checkIslocal()" ng-intro-options="IntroOptions" ng-intro-method="Introduce">
    <toast></toast>
        <script type="text/javascript" src="scripts/fbSDK.js"></script>
        <div id="fb-root"></div>
		
        <div class="blut-log-wrapper md-primary" md-colors="{background:'primary'}">
            <md-tooltip md-direction="right" style="z-index: 99999;">
                   {{ version }}
            </md-tooltip>
            <div class="left-toggle-wrapper" >
                <img src="{{image}}">
            </div>
        </div>

		<md-content class="main-headbar-slide" ng-mouseenter="headerToggleVisible = true" ng-mouseleave="headerToggleVisible = false">
			<div layout="row" layout-align="space-between center" style="padding: 0 25px">
			
				<div class="blut-search-wrapper hover-color" ng-click="openSearchBar()" aria-label="search" layout="row" flex>
					<i class="icon-search"></i>
					<span hide-sm hide-xs>Search</span>
				</div>
				<div class="blut-current-view border-left-light" flex hide-xs hide-sm>
					{{currentView}}
				</div>
				<div layout="row" layout-align="end center" class="blut-search-right-wrapper border-left-light">

					<div class="blut-header-icon" ng-click="mainclose()" id="home">
						<i class="icon-house-outline hover-color" md-colors="{color:'primary'}"></i>
						<md-tooltip md-direction="bottom">Go Home</md-tooltip>
					</div>
					<div class="blut-header-icon" ng-click="navigate('TV Mode')" id="fullscreen" hide-sm hide-xs>
						<i class="icon-full-size hover-color" md-colors="{color:'primary'}"></i>
						<md-tooltip md-direction="bottom">Toggle Fullscreen</md-tooltip>
					</div>
					<div class="blut-header-icon" ng-click="navigate('Clear Widgets')" id="clearWidgets">
						<i class="icon-broom hover-color" md-colors="{color:'primary'}"></i>
						<md-tooltip md-direction="bottom">Clear Widgets</md-tooltip>
					</div>
					<div class="blut-header-icon" ng-click="navigate('Save')"  id="save">
						<i class="ti-save hover-color" md-colors="{color:'primary'}"></i>
						<md-tooltip md-direction="bottom">Save Dashboard</md-tooltip>
					</div>
                    <md-menu class="blut-header-icon">
                    	<div  class="blut-header-icon" ng-click="$mdOpenMenu($event);$event.stopPropagation();">
                            <i class="ti-filter hover-color" md-colors="{color:'primary'}"></i>
                            <md-tooltip>filter</md-tooltip>
                    	</div>
                        <md-menu-content style="background:white;padding:10px;min-width: calc(40vh);min-height: calc(30vh);">
                            <div flex layout="row" style="min-height: 20px; max-height: 20px;cursor:pointer;">
                            	<v-accordion id="accordionMenu" class="vAccordion--default" control="accordionA" style="margin: 10px;width: 100%;" flex="row">
                            	<v-pane class="v-pane">
                            		<v-pane-header>
                            			<h5 class="font-weight-300 text-upper">Filter One</h5>
                            		</v-pane-header>
                            		<v-pane-content>
										<div> 
											<div class="bigcheck">
												<label class="filter-label display-inline-block">
													All
													<input type="checkbox" class="bigcheck" md-prevent-menu-close="md-prevent-menu-close"/>
													<span class="bigcheck-target pull-right"></span>
												</label>
											</div>
											<ul class="cutom-filter-ul" style="overflow: hidden;">
												<div class="bigcheck">
													<label class="filter-label" >
														value one
														<input type="checkbox" class="bigcheck" md-prevent-menu-close="md-prevent-menu-close"/>
														<span class="bigcheck-target pull-right"></span>
													</label>
												</div>
											</ul>
											<ul class="cutom-filter-ul" style="overflow: hidden;">
												<div class="bigcheck">
													<label class="filter-label" >
														value Two
														<input type="checkbox" class="bigcheck" md-prevent-menu-close="md-prevent-menu-close"/>
														<span class="bigcheck-target pull-right"></span>
													</label>
												</div>
											</ul>
										</div>
                            		</v-pane-content>
                            	</v-pane>
                            	<v-pane class="v-pane">
                            		<v-pane-header>
                            			<h5 class="font-weight-300 text-upper">Filter Two</h5>
                            		</v-pane-header>
                            		<v-pane-content>
										<div class="submenu">
											<div class="submenu" style="overflow: hidden;">
													<label>
														Value one
														<input type="radio" class="submenu"/>
													</label>
											</div>
											<div class="submenu" style="overflow: hidden;">
													<label>
														Value Two
														<input type="radio" class="submenu"/>
													</label>
											</div>
										</div>
                            		</v-pane-content>
                            	</v-pane>
                            	</v-accordion>
                            </div>                             
                        </md-menu-content>
                    </md-menu>
					<md-menu md-position-mode="target-right target" id="share">
					  <div class="blut-header-icon" aria-label="Open demo menu" class="md-icon-button" ng-click="$mdOpenMenu($event)">
						<i class="ti-share hover-color" md-colors="{color:'primary'}"></i>
						<md-tooltip md-direction="bottom">Share</md-tooltip>
					  </div>
					  <md-content>
						<md-menu-item ng-if="$root.dashboard.compID">
						  <md-button ng-click="navigate('sharedashboard', 'sharedashboard')">
							  <div layout="row" flex>
								<p flex>Share Dashboard</p>
							  </div>
						  </md-button>
						</md-menu-item>
						<md-menu-item>
						  <md-button ng-click="navigate('share', 'datasetShare')">
							  <div layout="row" flex>
								<p flex>Share Dataset</p>
							  </div>
						  </md-button>
						</md-menu-item>
					  </md-content>
					</md-menu>
					
					<div class="blut-header-icon" ng-click="openNotifications()" aria-label="notifications" id="notifications">
						<i class="ti-bell hover-color" md-colors="{color:'primary'}"></i>
						<div md-colors="{background:'accent'}"  style="width:15px;height:15px;border-radius:16px;color:white;margin-top:-30px;margin-left:15px;font-size:10px;font-weight:700;position:absolute"><div style="margin-left:4px;margin-top:1px;" ng-if="notifications.length <=9">{{notifications.length}}</div><div style="margin-left:1px;margin-top:3px;" ng-if="notifications.length > 9">{{notifications.length}}</div></div>
						<md-tooltip md-direction="bottom">Notifications</md-tooltip>
					</div>


					<div class="blut-profile-wrapper-header">
						<div layout="row" class="blut-login-user pull-right">
							<p ng-model="username">{{firstName }}</p>
							<div class="login-img"> 
								<img src="{{profile_pic}}"/>
							</div>
							<div class="dropdown">
								<button class="dropbtn" md-colors="{background:'accent'}"><i class="ti-angle-down"></i></button>
								<md-content class="dropdown-content">
									<a ng-click="navigate('switch tenant')">Switch Tenant</a>
									<a ng-click="navigate('my account')">My Account</a>
									<a ng-click="Introduce()">Help</a>
									<a ng-click="navigate('Logout')">
										<span flex="80">Logout</span>
									</a>
								</md-content>
							</div>
						</div>
					</div>
				</div>
				
			</div>
			<md-content class="blut-search-toggle  hover-color fadeHeaderToggle"  ng-show="headerToggleVisible || !showHeader" md-colors="{color:'primary'}" ng-click="topMenuToggle()">
				<span ng-if="!showHeader" class="ti-angle-down"></span>
				<span ng-if="showHeader" class="ti-angle-up"></span>
			</md-content>
		</md-content>
		
				<?php	
					//session_start();
					//echo "chamila";
					//var_dump($_SESSION);
					//var_dump($_SESSION["ShowMyAccount"]);
					//var_dump($_SESSION["Blocking"]);
				?>
				
				<?php 
					//session_start();  
					//if($_SESSION["Blocking"]) {echo "none";} else {echo "block";} 
				?>  <!--display : none;  or display : block-->

		<md-content class="left-menu-slide" ng-mouseenter="sideMenuToggleVisible = true" ng-mouseleave="sideMenuToggleVisible = false" style="height:100%;position:fixed;z-index:3;-webkit-box-shadow:2px 0 3px -2px #888;box-shadow:2px 0 3px -2px #888;top:45px; border-left: 3px solid #8b8b8b; overflow:inherit; ">
			<div id="cssmenu">

				<ul>
					<li style="height:30px;font-size:24px"  id="step1"><a md-colors="{color:'primary'}" ></a>

					</li>
					<li class="has-sub" style="height:50px;font-size:24px" ng-click="navigate('Add Page')" id="addPage">
						<md-tooltip md-direction="right">Add Page</md-tooltip>
						<a class="hover-color" md-colors="{color:'primary'}"><i class="icon-add-page"></i></a>
					</li>
					<li style="height:50px;font-size:24px" class="active has-sub" id="reports"><a class="hover-color" md-colors="{color:'primary'}" ><i class="icon-report"></i></a>
						<ul>
							<li><a class="cssmenu-heading" md-colors="{color:'primary-600'}">Reports</a></li>
							<li><a class="hover-color" md-colors="{color:'primary'}" ng-click="goTORout('home.Reports')"><i class="ti-filter sub-menu-icon"></i>Report Development</a></li>
						</ul>
					</li>
					<li style="height:50px;font-size:24px" class="active has-sub" id="datasource"><a class="hover-color" md-colors="{color:'primary'}"><i class="icon-database"></i></a>
						<ul>
							<li><a class="cssmenu-heading" md-colors="{color:'primary-600'}">Data Source</a></li>
							<li ng-click="navigate('Data Source')"><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-pie-chart sub-menu-icon"></i>Visualize Data</a></li>
							<li ng-click="navigate('User Assistance')"><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-wand sub-menu-icon"></i>User Assistance</a></li>
							<!--li ng-click="navigate($event,'Upload Source')"><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-upload sub-menu-icon"></i>Upload Source</a></li-->
						</ul>
					</li>
					<li class="has-sub" style="height:50px;font-size:24px" ng-click="navigate('Add Widgets')" id="addWidgets">
						<md-tooltip md-direction="right">Add Widgets</md-tooltip>
						<a class="hover-color" md-colors="{color:'primary'}"><i class="icon-plugin"></i></a>
					</li>
					<li class="has-sub" style="height:50px;font-size:24px" class="active has-sub" id="socialMedia"><a class="hover-color" md-colors="{color:'primary'}"><i class="icon-profile"></i></a>
						<ul>
							<li><a class="cssmenu-heading" md-colors="{color:'primary-600'}">Social Media</a></li>
							<li><a class="hover-color" md-colors="{color:'primary'}" ng-click="goTORout('home.social-graph-fb')"><i class="ti-facebook sub-menu-icon"></i>Facebook</a></li>
						 
						</ul>
					</li>
					<li class="has-sub" style="height:50px;font-size:24px" class="active has-sub" id="shareSocial"><a class="hover-color" md-colors="{color:'primary'}"><i class="icon-share"></i></a>
						<ul>
							<li><a class="cssmenu-heading" md-colors="{color:'primary-600'}">Share</a></li>
							<li><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-facebook sub-menu-icon"></i>Facebook</a></li>
							<li><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-google sub-menu-icon"></i>Google+</a></li>
							<li><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-twitter sub-menu-icon"></i>Twitter</a></li>
							<li><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-linkedin sub-menu-icon"></i>Linkedin</a></li>
							<li><a class="hover-color" md-colors="{color:'primary'}" ng-click="goTORout('Email')"><i class="ti-email sub-menu-icon"></i>Email</a></li>
						</ul>
					</li>
					<li class="has-sub" style="height:50px;font-size:24px" class="active has-sub" id="settings"><a class="hover-color" md-colors="{color:'primary'}"><i class="icon-settings"></i></a>
						<ul>
							<li><a class="cssmenu-heading" md-colors="{color:'primary-600'}">Settings</a></li>
							<li ng-click="goTORout('home.userAdministrator')"><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-user sub-menu-icon"></i>User Administration</a></li>
							<li ng-click="goTORout('home.systemSettings')"><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-settings sub-menu-icon"></i>System Settings</a></li>
							<li ng-click="goTORout('home.themes')"><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-palette sub-menu-icon"></i>Themes</a></li>
							<li ng-click="goTORout('home.datasourceSettings')"><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-server sub-menu-icon"></i>Datasource Settings</a></li>				
							<li ng-click="goTORout('home.dashboardFilterSettings')"><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-filter sub-menu-icon"></i>Dashboard Filters</a></li>	
						</ul>
					</li>
					
					


				</ul><!-- -->
				
				
				
				<md-content class="left-menu-toggle hover-color fadeSideMenuToggle" ng-show="sideMenuToggleVisible || !showSideMenu" md-colors="{color:'primary'}" ng-click="leftMenuToggle()">
					<span ng-if="!showSideMenu" class="ti-angle-right"></span>
					<span ng-if="showSideMenu" class="ti-angle-left"></span>
				</md-content>
			</div>
		</md-content>
        <!-- sidebar end -->
        <!-- ui view start -->
        <ul ui-view layout="column" id="content1">

        </ul>
        <!-- ui view end -->
        <!-- Common data source start -->

        <div class="commonDataSource" ng-include src="'views/common-data-src/ViewCommonDataSrc.html'" ng-controller="commonDataSrcInit">
        </div>

        
        <div class="overlay">
            <div class="overlay">
                <!--<div class="starting-point">-->
                <!--<span></span>-->
                <!--</div>-->
            </div>
        </div>

</div>
