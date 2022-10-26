/************************************************************************* * 
 * BTI325– Assignment 3 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part * 
 * of this assignment has been copied manually or electronically from any other source * 
 * (including 3rd party web sites) or distributed to other students. * 
 * Name: Mohammed Aminoor Rahman Student ID: 166562215 Date: October 20th, 2022 * 
 * Your app’s URL (from HEROKU) :  https://radiant-reaches-74214.herokuapp.com/   * 
 **************************************************************************/

var express = require("express");
const { type } = require("os");
var app = express();
const multer = require("multer");
var path = require("path");
const fs = require('node:fs')



var data_service = require("./data-service");

app.use(express.json());
app.use(express.urlencoded({extended: true}));


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

app.get("/employee/:value", function (req,res){

    
    data_service.getEmployeeByNum(req.params.value).then((mang)=>{
        res.json(mang);
    }).catch((mesg)=>{
        console.log(mesg);
    })

});

app.get("/employees", function (req,res){
    
    if(req.query.status){
        data_service.getEmployeesByStatus(req.query.status).then((emp)=>{
            res.json(emp);
        }).catch((mesg)=>{
            console.log(mesg);
        })

    }
    else if(req.query.department){

        data_service.getEmployeesByDepartment(req.query.department).then((emp)=>{
            res.json(emp);
        }).catch((mesg)=>{
            console.log(mesg);
        })


    }
    else if(req.query.manager){
        data_service.getEmployeesByManager(req.query.manager).then((emp)=>{
            res.json(emp);
        }).catch((mesg)=>{
            console.log(mesg);
        })
        
    }
    else{
        data_service.getAllEmployees().then((emp)=>{
            res.json(emp);
        }).catch((mesg)=>{
            console.log(mesg);
        })
    }

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

app.get("/images", function (req,res){

    fs.readdir("./public/images/uploaded", function(err,items){

        if(err){
            console.log("Error reading Directory");
        }
        else{
            
            res.json(items);

        }
        
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


app.post("/images/add", upload.single("imageFile"), (req,res) => {

    res.redirect("/images");

});

app.post("/employees/add", (req,res) => {


    data_service.addEmployee(req.body).then(()=>{
        res.redirect("/employees");
    }).catch(()=>{
        console.log('ERROR');
    })

});



// setup http server to listen on HTTP_PORT
data_service.initialize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
  }).catch((mesg)=>{
    console.log(mesg);
  });
