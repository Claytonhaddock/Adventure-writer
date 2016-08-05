var express = require("express");
var app = express();
var port = 8080;
var mongodbUrl = "mongodb://user:password@ds047802.mongolab.com:47802/adbuilderdb";
var io = require('socket.io').listen(app.listen(port));

var mongoose = require('mongoose');
mongoose.connect(mongodbUrl);
var db = mongoose.connection;
var returnedLines = [];



db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("Successfully connected to database");
    console.log("Listening on port: "+ port);
    
    app.set('views', __dirname + '/tpl');
    app.set('view engine', "jade");
    app.engine('jade', require('jade').__express);
    app.get("/", function(req, res){
        res.render("page");
    });
    app.use(express.static(__dirname + '/public'));
    
        

    var dataSchema = mongoose.Schema({
        line: String,
    });
    var Data = mongoose.model('data', dataSchema);
    
    io.sockets.on('connection', function (socket) {

    	Data.find({}, function (err, result) {
    	    if (err) {
    	        console.log(err);
    	    } else {
    	        
    	          for(var i=0; i<result.length; i++)
    	                {
    	            returnedLines.push(result[i].line);         
    	          }

    	          socket.emit('count', { whatever : returnedLines });
    	          returnedLines =[];
    	    }
    	}); 

    	
        socket.on('click', function(data) {
            var newData = new Data({line: data.phrase});
            newData.save();

            
            Data.find({}, function (err, result) {
                if (err) {
                    console.log(err);
                } else {

                    
                      for(var i=0; i<result.length; i++)
                            {
                        returnedLines.push(result[i].line);         
                      }

                      socket.emit('count', { whatever : returnedLines });
                      returnedLines =[];
                      if(result.length>=10) {
                      	for(var i=0; i<result.length; i++)
                            {
                        result[i].remove();         
                      }
                		
                	}
                }
            }); //end of find()


        });
    });
});