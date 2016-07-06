function main(){
    
    scope.submit = function(){
        scope.user.id="123";
        $objectstore.getClient("testuser").onComplete(function(){
            alert ("Successfully Inserted");
        }).onError(function(err){
            alert ("Error Inserting");
        }).insert([scope.user], {KeyProperty:"id"});
    }
    
    $objectstore.getClient("testuser").onGetMany(function(data){
        alert (JSON.stringify(data));
        scope.allusers = data
        
    }).onError(function(err){
        alert ("Error Retrieving all Users");
    }).getByKeyword("*");
    
    
    
}