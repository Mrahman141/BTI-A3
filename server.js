/************************************************************************* * 
 * BTI325– Assignment 2 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part * 
 * of this assignment has been copied manually or electronically from any other source * 
 * (including 3rd party web sites) or distributed to other students. * 
 * Name: Mohammed Aminoor Rahman Student ID: 166562215 Date: October 7th, 2022 * 
 * Your app’s URL (from Cyclic) :  * 
 **************************************************************************/

var express = require("express");
const { type } = require("os");
var app = express();
const multer = require("multer");
var path = require("path");

var data_service = require("./data-service");


app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

 // setup another route to listen on /about
app.get("/about", function (req, res){
    res.sendFile(path.join(__dirname, "/views/about.html"));
});


app.get("/employees/add", function (req, res){
    res.sendFile(path.join(__dirname, "/views/addEmployee.html"));
});

app.get("/images/add", function (req, res){
    res.sendFile(path.join(__dirname, "/views/addImage.html"));
});


app.get("/employees", function (req,res){
    
    data_service.getAllEmployees().then((emp)=>{
        res.json(emp);
    }).catch((mesg)=>{
        console.log(mesg);
    })

});

app.get("/managers", function (req,res){
    data_service.getManagers().then((mang)=>{
        res.json(mang);
    }).catch((mesg)=>{
        console.log(mesg);
    })
});

app.get("/departments", function (req,res){

    data_service.getDepartments().then((dept)=>{
        res.json(dept);
    }).catch((mesg)=>{
        console.log(mesg);
    })

});


app.get('*', function(req, res){
    var text = 'Error:404 <br/> You are not supposed to be here. <br/> Why are you still here? <br/> If you like this page, then alright, you can stay here.';
    text += '<br/> Or you can go back Home and explore the Website.';
    text += "<a href='/'> Home </a>";

    res.send(text, 404);
});


const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage: storage });


// setup http server to listen on HTTP_PORT
data_service.initialize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
  }).catch((mesg)=>{
    console.log(mesg);
  });
