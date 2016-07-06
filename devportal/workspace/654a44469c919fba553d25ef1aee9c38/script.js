function main(){
    $objectstore.getClient("customer")
    .onGetOne(function(data){
        alert (JSON.stringify(data));
    })
    .onError(function(err){
        alert ("Error Retrieving Object");
    }).getByKey("12");
    
    
}