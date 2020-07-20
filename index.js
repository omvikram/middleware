const express = require("express");
const app = express();

app.get("/", function(req, res){
    res.send("This is get finction in express framework")
})

app.listen(3000, function(){
    console.log("I am listening..at 3000 port")
})