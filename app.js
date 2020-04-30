//requires
//connect to db
//instantiate express app
//middleware required
//routes
//error handler middleware
//listener

const express = require("express");
// console.log(process.env);
const mongoose = require("mongoose");

var User = require("./models/user");
const PORT = process.env.PORT||3000;

var app = express();
//connect to db
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/mongoose-crud', 
{useNewUrlParser: true, useUnifiedTopology: true},
(err) =>{
    console.log(err);
});

app.get('/', (req, res) =>{
    res.send('Mongoose-CRUD-App');
});

app.get("/users", (req, res, next) =>{
    User.find(({}), (err, users) =>{
        if(err)
            return next(err);
        return res.json(users);
    });
});
app.post("/users", (req, res,next) => {
    //grab body data
    console.log(req.body);
    //save a data to database
    User.create(req.body, (err, data) => {
        if(err) return next(err);
        console.log(req.body);
        return res.json(data);
    });
    //send a response to client
});
app.put("/users/:email", async(req, res, next) => {
    //grab body data
    console.log(req.body);
    var email = req.params.email;
    //save a data to database
    // User.findByIdAndUpdate((id, req.body), (err, data) => {
    //     console.log('HERe', err);
    //     if(err) return next(err);
    //     if(!data)
    //         return res.json({message:'User not found'});
    //     console.log(req.body);
    //     return res.json(data);
    // });
    try{
    let user = await User.findOneAndUpdate({email}, req.body, {new: true});
    if(!user)
        return res.json({message:'User not found'});   
        res.json(user);
    }
    
    catch(error){
        return res.json({error})
    }
    //send a response to client
});

app.delete("users/:id", async(req, res, next) =>{
    var id = req.params.id;
    console.log(id);
    // User.findOneAndDelete({email}, (err, user) =>{
    //     if(err) return next(err);
        
    //     return res.json({success: true, message: `Successfully deleted ${user.email}`});
    // });
    try{
        let user = await User.findByIdAndDelete(id);
        if(!user)
            return res.json({message:'User not found'});   
            return res.json({success: true, message: `Successfully deleted ${user.email}`});
        }
        
        catch(error){
            return res.json({error})
        }
});
app.get("/users/:email", (req, res, next) =>{
    var email = req.params.email;

    User.findOne(({"email": email}), (err, users) =>{
        if(err)
            return next(err);
        else
            res.json({users});
        
    });
});



//error handle middlewares
//404
app.use((err,req, res, next) =>{
    res.statusCode = 404;
    res.send('Page not found');
    //same as res.status(404).send('Page not found');
});

//client or sever error
app.use((err, req, res, next) =>{
    if(err.name === "ValidationError"){
        res.json({err});
    }
    return res.json({err});
});
//listen port
app.listen(PORT, ()=> {
    console.log('server started on port', PORT);
});