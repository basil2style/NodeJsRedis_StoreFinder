var bodyParser = require('body-parser')
var express = require('express')
var redis = require('redis')
var client = redis.createClient();

app = express();

app.set('view engine','pug')

app.get('/',function(req,res){
    res.render('index',{
        pageTitle:'University Finder'
    });
});

app.post('/',bodyParser.urlencoded({ extended:false}),
    function(req,res){
        var latitude = req.body.latitude,
         longitude = req.body.longitude;

         client.georadius('va-universities',longitude,latitude,
         '100',
         'mi',
         'WITHCOORD',
         'WITHDIST',
         'ASC',
         function(err,results) {
             if(err) {
                 next(err);
             }
             else {
                 results = results.map(function(aResult){
                     var resultObject = {
                         key : aResult[0],
                         distance : aResult[1],
                         longitude : aResult[2][0],
                         latitude : aResult[2][1]
                     };
                     return resultObject;
                 })
            res.render('index',{
            pageTitle : 'University Finder Result',
            latitude : latitude,
            longitude : longitude,
            results : []
        });
             }
         }

         )
       
    });

app.listen(3000,function() {
    console.log('Sample store finder is running')
})