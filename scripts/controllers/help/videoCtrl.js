/**
 * Created by Damith on 4/8/2016.
 */

'use strict'
;
routerApp.controller('videoCtrl', function ($scope, $sce, $state) {

    //help video obj
    $scope.videosObj = [
        {
            id: 'h1',
            header: 'DigIn - Analyze your data from anywhere, anytime and any device',
            url: [{
                src: $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=wRMesyynKFI"),
            }], desc: "",
            isView: false,
            onClick: true
        },
         {
            id: 'h2',
            header: 'Digin Team Bloopers',
            url: [{
                src: $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=P8xuemsPM5k"),
            }], desc: "",
            isView: false,
            onClick: false
        },
        {
            id: 'h2',
            header: 'ETL using talend',
            url: [{
                src: $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=R5nxTQjWdCA"),
            }], desc: "",
            isView: false,
            onClick: false
        },
        {
            id: 'h3',
            header: 'Docs, Sheets, Slides, and other apps',
            url: [{
                src: $sce.trustAsResourceUrl("https://youtu.be/tLE_zHc3oDE"),
            }],
            desc: "",
            isView: false,
            onClick: false
        },
    ];

    //eventHandler
    var eventHandler = {
        loadVideo: '',
        setAllFalse: function () {
            var obj = $scope.videosObj;
            for (var i = 0; i < obj.length; i++) {
                $scope.videosObj[i].onClick = false;
            }
        },
        changeClickEvent: function (video) {
            var obj = $scope.videosObj;
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].id == video.id) {
                    $scope.videosObj[i].onClick = true;
                }
            }
        },
        onLoadVideo: function (video) {
            $scope.eventHandler.loadVideo = video;
            eventHandler.setAllFalse();
            eventHandler.changeClickEvent(video);
        },
        onLoad: function () {
            eventHandler.loadVideo = $scope.videosObj[0];
        }
    }
    $scope.eventHandler = eventHandler;
    eventHandler.onLoad();

    $scope.config = {
        preload: "true",
        sources: [
            {
                src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"),
                type: "video/mp4"
            },
            {
                src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"),
                type: "video/webm"
            },
            {
                src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"),
                type: "video/ogg"
            }
        ],
        tracks: [
            {
                src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                kind: "subtitles",
                srclang: "en",
                label: "English",
                default: ""
            }
        ],
        theme: {
            url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
        }
    };

    $scope.goWelcomeScreen = function () {
        $state.go('home.welcomeSearch');
    }

});