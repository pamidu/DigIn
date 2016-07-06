function main(){
   /* $objectstore.getClient("customer")
    .onGetOne(function(data){
        alert (JSON.stringify(data));
    })
    .onError(function(err){
        alert ("Error Retrieving Object");
    }).getByKey("12");*/
    
   $objectstore.getClient("employee")
   .onGetMany(function(data){
       alert("Sucess");
   })
   .onError(function(err){
       alert("Error");
   }).getByKeyword("id");

}