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
            header: 'Google Drive on the web',
            url: [{
                src: $sce.trustAsResourceUrl("https://youtu.be/Y0YxYV6-9Bw"),
            }], desc: "Lorem Ipsum is simply dummy text of the printing and " +
        "typesetting industry. Lorem Ipsum has been the industry's standard" +
        " dummy text ever since the 1500s, when an unknown printer took a galley" +
        " of type and scrambled it to make a type specimen book. It has survived" +
        " not only five centuries, but also the leap into" +
        " electronic typesetting, remaining essentially unchanged.",
            isView: false,
            onClick: true
        },
        {
            id: 'h2',
            header: 'Google Drive for your Mac/PC',
            url: [{
                src: $sce.trustAsResourceUrl("https://youtu.be/9No-FiEInLA"),
            }], desc: "Lorem Ipsum is simply dummy text of the printing and " +
        "typesetting industry. Lorem Ipsum has been the industry's standard" +
        " dummy text ever since the 1500s, when an unknown printer took a galley" +
        " of type and scrambled it to make a type specimen book. It has survived" +
        " not only five centuries, but also the leap into" +
        " electronic typesetting, remaining essentially unchanged.",
            isView: false,
            onClick: false
        },
        {
            id: 'h3',
            header: 'Docs, Sheets, Slides, and other apps',
            url: [{
                src: $sce.trustAsResourceUrl("https://youtu.be/tLE_zHc3oDE"),
            }],
            desc: "Lorem Ipsum is simply dummy text of the printing and " +
            "typesetting industry. Lorem Ipsum has been the industry's standard" +
            " dummy text ever since the 1500s, when an unknown printer took a galley" +
            " of type and scrambled it to make a type specimen book. It has survived" +
            " not only five centuries, but also the leap into" +
            " electronic typesetting, remaining essentially unchanged.",
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