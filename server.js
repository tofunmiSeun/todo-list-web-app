var express = require("express");
var fs = require("fs");
var mongodb = require("mongodb");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("front-end"));

var mongoClient = mongodb.MongoClient;

var mongoUrl = 'mongodb://127.0.0.1:27017/node-test';

// Serve index page
app.get("/", function(req, res){
	res.sendFile(__dirname + '/front-end/index.html');
});

app.put("/todo/add", function(req, res){
	var todo = req.body;
	mongoClient.connect(mongoUrl, function(error, db){
		if (!error){
			console.log("connection to db established...saving todo");

			var collection = db.collection("todos");
			collection.insert(todo, function(err, result){
				if (err){
					console.log(err);
				}else{
					console.log("todo saved!");
				}
			});

			db.close();
		}else{
			console.log(error);
			console.log("db connection error")
		}
	});
	res.end();
});

app.get("/todos", function(req, res){
	mongoClient.connect(mongoUrl, function(error, db){
		if (!error){
			console.log("getting todos...");

			db.collection("todos").find().toArray(function(err, todos){
				if (!err){
					res.json(todos);
				}
			});
			db.close();
		}else{
			console.log("db connection error")
		}
	});
});

app.post("/todo/delete", function(req, res){
	var todo = req.body;
	mongoClient.connect(mongoUrl, function(error, db){
		if (!error){
			db.collection("todos").remove({"message": todo.message, "dateCreated": todo.dateCreated}, function(err, results){
				if (!err){
					res.end();
				}
			});
			db.close();
		}
	});
});

app.post("/todo/edit", function(req, res){
	var oldMessage = req.body.oldMessage;
	var todo = req.body.newTodo;
	mongoClient.connect(mongoUrl, function(error, db){
		if (!error){
			db.collection("todos").update({"message": oldMessage, "dateCreated": todo.dateCreated},
			 {$set: {"message": todo.message}},
			 function(err, results){
				if (!err){
					res.end();
				}
			});
			db.close();
		}
	});
});

// Start server
var server = app.listen(69, "127.0.0.1", function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("server listening on %s, : %s", host, port);
});
