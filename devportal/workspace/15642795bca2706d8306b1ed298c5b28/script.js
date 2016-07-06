function main(){
scope.isBusy=false;
scope.bible;
scope.chapters=[{"name":"Genesis","chapters":50},
{"name":"Exodus","chapters":40},
{"name":"Leviticus","chapters":27},
{"name":"Numbers","chapters":36},
{"name":"Deuteronomy","chapters":34},
{"name":"Joshua","chapters":24},
{"name":"Judges","chapters":21},
{"name":"Ruth","chapters":4},
{"name":"1 Samuel","chapters":31},
{"name":"2 Samuel","chapters":24},
{"name":"1 Kings","chapters":22},
{"name":"2 Kings","chapters":25},
{"name":"1 Chronicles","chapters":29},
{"name":"2 Chronicles","chapters":36},
{"name":"Ezra","chapters":10},
{"name":"Nehemiah","chapters":13},
{"name":"Esther","chapters":10},
{"name":"Job","chapters":42},
{"name":"Psalms","chapters":150},
{"name":"Proverbs","chapters":31},
{"name":"Ecclesiastes","chapters":12},
{"name":"Song of Songs","chapters":8},
{"name":"Isaiah","chapters":66},
{"name":"Jeremiah","chapters":52},
{"name":"Lamentations","chapters":5},
{"name":"Ezekiel","chapters":48},
{"name":"Daniel","chapters":12},
{"name":"Hosea","chapters":14},
{"name":"Joel","chapters":3},
{"name":"Amos","chapters":9},
{"name":"Obadiah","chapters":1},
{"name":"Jonah","chapters":4},
{"name":"Micah","chapters":7},
{"name":"Nahum","chapters":3},
{"name":"Habakkuk","chapters":3},
{"name":"Zephaniah","chapters":3},
{"name":"Haggai","chapters":2},
{"name":"Zechariah","chapters":14},
{"name":"Malachi","chapters":4},
{"name":"Matthew","chapters":28},
{"name":"Mark","chapters":16},
{"name":"Luke","chapters":24},
{"name":"John","chapters":21},
{"name":"Acts","chapters":28},
{"name":"Romans","chapters":16},
{"name":"1 Corinthians","chapters":16},
{"name":"2 Corinthians","chapters":13},
{"name":"Galatians","chapters":6},
{"name":"Ephesians","chapters":6},
{"name":"Philippians","chapters":4},
{"name":"Colossians","chapters":4},
{"name":"1 Thessalonians","chapters":5},
{"name":"2 Thessalonians","chapters":3},
{"name":"1 Timothy","chapters":6},
{"name":"2 Timothy","chapters":4},
{"name":"Titus","chapters":3},
{"name":"Philemon","chapters":1},
{"name":"Hebrews","chapters":13},
{"name":"James","chapters":5},
{"name":"1 Peter","chapters":5},
{"name":"2 Peter","chapters":3},
{"name":"1 John","chapters":5},
{"name":"2 John","chapters":1},
{"name":"3 John","chapters":1},
{"name":"Jude","chapters":1},
{"name":"Revelation","chapters":22}
];
 //scope.chapter={"name":"John"};
 //scope.verse="1";
    console.log("im in the main");
    
    function getContent(chapter,verse){
        if(verse==""){
            return;
        }
        scope.isBusy=true;
        $.ajax({
        url:'http://getbible.net/json',
        dataType: 'jsonp',
        data: 'p='+chapter+''+verse+'&v=akjv',
        jsonp: 'getbible',
        success:function(json){
            scope.$apply(function(){
                scope.bible =  json;
                scope.isBusy=false;
            })
        },
        error:function(){
            alert ("Error!!!");
            scope.$apply(function(){
                scope.isBusy=false;
            })
            //jQuery('#scripture').html('<h2>No scripture was returned, please try again!</h2>'); // <---- this is the div id we update
         }
            
        });
    }
    
    scope.$watch("verse",function(){
         
          if(scope.verse==""){
             return;
          }
         console.log("im in the updateContent " +scope.chapter.name+ " - "+scope.verse);
         getContent(scope.chapter.name,scope.verse);
    });
    
    
    scope.$watch("chapter",function(){
         scope.verses=[];
         i=1;
         while(i!=scope.chapter.chapters){
             scope.verses.push(i);
             i++;
         }
         scope.verse=scope.verses[0];
         getContent(scope.chapter.name,scope.verse);
         console.log(scope.verses);
    });
    
    function updateContent(){
        console.log("im in the updateContent " +scope.chapter.name+ " - "+scope.verse);
        getContent(scope.chapter.name,scope.verse);    
    }
    //updateContent();
    //getContent("John","1");
    
}