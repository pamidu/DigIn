    var auth2 = {};
    var helper = (function() {
        return {
            onSignInCallback: function(authResult) {
                $('#authResult').html('Auth Result:<br/>');
                for (var field in authResult) {
                    $('#authResult').append(' ' + field + ': ' +
                        authResult[field] + '<br/>');
                }
                if (authResult.isSignedIn.get()) {
                    $('#authOps').show('slow');
                    $('#gConnect').hide();
                    helper.profile();
                    helper.people();
                    helper.peoplee();
                    helper.peopless();
                    helper.activities();
                    helper.organizationsu();
                    helper.placestofind();
                    helper.followings();
                    helper.makeGoogleApiCalls();
                } else if (authResult['error'] ||
                    authResult.currentUser.get().getAuthResponse() == null) {
                    console.log('There was an error: ' + authResult['error']);
                    $('#authResult').append('Logged out');
                    $('#authOps').hide('slow');
                    $('#gConnect').show();
                }

                console.log('authResult', authResult);
            },

            /**
             * Calls the OAuth2 endpoint to disconnect the app for the user.
             */
            disconnect: function() {
                // Revoke the access token.
                auth2.disconnect();
            },

            /**
             * Gets and renders the list of people visible to this app.
             */
            people: function() {
                gapi.client.plus.people.list({
                    'userId': 'me',
                    'collection': 'visible'
                }).then(function(res) {
                    var people = res.result;
                    $('#visiblePeople').empty();
                    $('#visiblePeople').append('<h6>' +
                        people.totalItems + '</h6>');
                    for (var personIndex in people.items) {
                        person = people.items[personIndex];
                        $('#visiblePeople').append('<p>' + '<h6>Name:</h6>' + person.displayName + '</br>' + '<img style="width:50px;height:50px;" src="' + person.image.url + '">' + '</p><br/>');
                    }
                });
            },

            peoplee: function() {
                gapi.client.plus.people.list({
                    'userId': 'me',
                    'collection': 'visible'
                }).then(function(res) {
                    var people1 = res.result;
                    $('#followerss').empty();
                    $('#followerss').append('<h6>' +
                        people1.totalItems + '</h6><br/>');
                    for (var personIndex in people1.items) {
                        person1 = people1.items[personIndex];
                        $('#followerss').append('');
                    }
                });
            },

            peopless: function() {
                gapi.client.plus.people.list({
                    'userId': 'me',
                    'collection': 'connected'
                }).then(function(res) {
                    var peoplee = res.result;
                    $('#connectedPeople').empty();
                    $('#connectedPeople').append('<h6>' +
                        peoplee.totalItems + '</h6><br/>');
                    for (var personIndex in peoplee.items) {
                        personn = peoplee.items[personIndex];
                        $('#connectedPeople').append('<img src="' + person.image.url + '">');
                    }
                });
            },

            /**
             * Gets and renders the list of activities visible to this app.
             */

            activities: function() {
                gapi.client.plus.activities.list({
                    'userId': 'me',
                    'collection': 'public'
                }).then(function(res) {

                    var activitiess = res.result;
                    $('#activitylist').empty();
                    // $('#activitylist').append('');
                    for (var activityIndex in activitiess.items) {
                        activityy = activitiess.items[activityIndex];
                        $('#activitylist').append('<h6>Post Title: ' +
                            activityy.title + '</h6>' + '<h6> No of replies: ' + activityy.object.replies.totalItems + '</br> No of plusoners: ' + activityy.object.plusoners.totalItems + '</br> No of resharers: ' + activityy.object.resharers.totalItems + '</h6></h6><br/>');
                    }
                    // console.log('activitylist', res.result);
                    // console.log("Done!");
                });
            },


            organizationsu: function() {
                gapi.client.plus.people.get({
                    'userId': 'me',

                }).then(function(res) {

                    var org = res.result;
                    $('#orglist').empty();
                    // $('#orglist').append(
                    //   $('<p>test: ' +
                    //    org.organizations + '</p><br/>'));
                    for (var orgIndex in org.organizations) {
                        orgs = org.organizations[orgIndex];
                        $('#orglist').append('<h6>User organizations:</h6>' + '<p>' + orgs.name + '</p><br/>');
                    }
                    // console.log('orglist',res.result);
                    // console.log("Done!");
                });
            },

            placestofind: function() {
                gapi.client.plus.people.get({
                    'userId': 'me',

                }).then(function(res) {

                    var places = res.result;
                    $('#placelist').empty();
                    // $('#orglist').append(
                    //   $('<p>test: ' +
                    //    org.organizations + '</p><br/>'));
                    for (var placeIndex in places.placesLived) {
                        placess = places.placesLived[placeIndex];
                        $('#placelist').append('<h6>User contact:</h6>' + '<p>' + placess.value + '</p><br/>');
                    }
                    // console.log('orglist',res.result);
                    // console.log("Done!");
                });
            },


            followings: function() {
                gapi.client.plus.people.get({
                    'userId': 'me',

                }).then(function(res) {

                    var following = res.result;
                    $('#followinglist').empty();
                    $('#followinglist').append(
                        $('<h6>' +
                            following.circledByCount + '</h6><br/>'));
                    for (var folowingIndex in following.circledByCount) {
                        follow = following.circledByCount[folowingIndex];
                        $('#followinglist').append('<p>' + '</br> Name:' + follow.displayName + '</br>' + '<img src="' + follow.image.url + '">' + '</p><br/>');
                    }
                    // console.log('orglist',res.result);
                    // console.log("Done!");
                });
            },


            /**
             * Gets and renders the currently signed in user's profile data.
             */

            profile: function() {
                gapi.client.plus.people.get({
                    'userId': 'me'
                }).then(function(res) {
                    var profile = res.result;
                    console.log(profile);
                    $('#profile').empty();
                    $('#profile').append(
                        $('<p><img style="width:50px;height:50px;" src=\"' + profile.image.url + '\"></p><br/>'));
                    // $('#profile').append(
                    //      $('<p><img src=\"' + profile.cover.coverPhoto.url + '\"></p><br/>'));
                    $('#profile').append(
                        $('<h6>Profile Name:</h6>'+ '<p>' + profile.displayName + '</p><br/>' + '<h6>Family Name:</h6>' + '<p>' + profile.name.familyName + '</p><br/>' + '<h6>Profile ID:</h6>' + '<p>' + profile.id + '</p><br/>' + '<h6>Tagline:</h6> ' + '<p>' +
                            profile.tagline + '</p><br/>' + '<h6>About me:</h6>' + '<p>' + profile.aboutMe + '</p><br/>' + '<h6>Google category:</h6>' + '<p>' + profile.kind + '</p><br/>' + '<h6>User type:</h6>' + '<p>' + profile.objectType + '</p><br/>' + '<h6>Gender:</h6>' + '<p>' + profile.gender + '</p><br/>' + '<h6>Studied at:</h6>' + '<p>' + profile.braggingRights + '</p><br/>' + '<h6>Occupation:</h6>' + '<p>' + profile.occupation + '</p><br/>' + '<h6>Other names:</h6>' + '<p>' + profile.name.givenName + '</p><br/>' + '<h6>Google+ account validity:</h6>' + '<p>' + profile.isPlusUser + '</p><br/>' + '</h6><br/>'));

                    if (profile.emails) {
                        // $('#profile').append('<p>Emails: ' + profile.emails + '</p><br/>');
                        for (var i = 0; i < profile.emails.length; i++) {
                            $('#profile').append(
                                $('<p></br> Emails: ' + profile.emails[i].value + '<p><br/>'));
                        }
                        $('#profile').append('');
                    }
                    if (profile.cover && profile.coverPhoto) {
                        $('#profile').append(
                            $('<p><img src=\"' + profile.cover.coverPhoto.url + '\"></p>'));
                    }
                }, function(err) {
                    var error = err.result;
                    $('#profile').empty();
                    $('#profile').append(error.message);
                });
            }
        };
    })();


    /**
     * jQuery initialization
     */
    $(document).ready(function() {
        $('#disconnect').click(helper.disconnect);
        $('#loaderror').hide();
        if ($('meta')[0].content == '158536425125-rgrgvk6sg44uosq2nu3g44n81r9j2ncl.apps.googleusercontent.com') {
            alert('This app working with the OAuth credentials and access provided by Thisura Indula and all rights reserved by the author (Thisura Indula)' + ' from the Google APIs console:\n' +
                'https://code.google.com/apis/console/#:access\n\n'
            );
        }
    });

    /**
     * Handler for when the sign-in state changes.
     *
     * @param {boolean} isSignedIn The new signed in state.
     */
    var updateSignIn = function() {
        console.log('update sign in state');
        if (auth2.isSignedIn.get()) {
            console.log('signed in');
            helper.onSignInCallback(gapi.auth2.getAuthInstance());
        } else {
            console.log('signed out');
            helper.onSignInCallback(gapi.auth2.getAuthInstance());
        }
    }

    /**
     * This method sets up the sign-in listener after the client library loads.
     */
    function startApp() {
        gapi.load('auth2', function() {
            gapi.client.load('plus', 'v1').then(function() {
                gapi.signin2.render('signin-button', {
                    scope: 'https://www.googleapis.com/auth/plus.login',
                    fetch_basic_profile: false
                });
                gapi.auth2.init({
                    fetch_basic_profile: false,
                    scope: 'https://www.googleapis.com/auth/plus.login'
                }).then(
                    function() {
                        console.log('init');
                        auth2 = gapi.auth2.getAuthInstance();
                        auth2.isSignedIn.listen(updateSignIn);
                        auth2.then(updateSignIn());
                    });
            });
        });
    }
