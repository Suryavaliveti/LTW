const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const app=express();
const port=8000;
app.use(express.static(__dirname));
app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userdata");
const db=mongoose.connection;
db.once('open',()=>{
    console.log("mongodb connected");
})
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    
    password:{
        type:String,
        required:true,
    },
    
});
const Users=mongoose.model("data",userSchema);

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,'sign in.html'));
});
// app.post('/post',async (req,res)=>{
//     const {username,email,password}=req.body;
//     const user=new Users({
//         username,
//         email,
//         password,
//     });
//     await user.save();
//     console.log(user);
//     res.send("user has sucessfully ceated..");

// });


app.post('/post', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email is already registered." });
    }

    try {
        const user = new Users({
            username,
            email,
            password,
        });
        await user.save();
        res.status(200).json({ message: "User has been successfully created." });
    } catch (err) {
        console.log("Error saving user:", err);
        res.status(500).json({ message: "Error creating user: " + err.message });
    }
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await Users.findOne({ email });
  
      if (!user) {
         return res.send("User not found" );
      }
      if (user.password !== password) {
        return res.status(400).json({ message: "Incorrect password" });
      }
      res.redirect('/options.html');
  
    //   res.status(200).send('Login successful');
    //   res.send(`<html><h3>Welcome ${username}</h3></html>`)
    } 
    catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
});
  


app.listen(port,()=>console.log(`server started at port ${port}`));
