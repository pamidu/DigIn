function main(){
    $objectstore.getClient("user").onGetMany(function(data){
        
    }).onError(function(err){
        
    }).getByFiltering("select * from users");
}