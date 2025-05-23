const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");
const { error, log } = require("console");

app.use(express.json());
app.use(cors());

// Database connection with mongo
mongoose.connect("mongodb+srv://akashkarthi10g:o6YfNGqfErnpaTTZ@cluster0.afm69hg.mongodb.net/e-commerce")

// api creation

app.get("/",(req,res)=>{
    res.send("Express is working")
})

// Image storage engine
const storage = multer.diskStorage({
    destination: './upload/images', // CHANGED
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage });

// 🔧 CHANGED: Serve uploaded images publicly
app.use('/images', express.static('upload/images'));

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`https://e-commerce-backend-chhq.onrender.com/images/${req.file.filename}`
    })
})


// Schema for products

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required: true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required:true,
    },
    new_price:{
        type: Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    avaiable:{
        type:Boolean,
        default:true,
    },
})

// adding product in db
app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else
    {
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

// to remove from the db

app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

//get allproduct

app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({});
    console.log("all products fetched");
    res.send(products);
})

    //Schema creating user model

const Users = mongoose.model('Users',{
        name:{
            type:String,
        },
        email:{
            type:String,
            unique:true,
        },
        password:{
            type:String,
        },
        cartData:{
            type:Object,
        },
        date:{
            type:Date,
            default:Date.now,
    }
})

    //Creating end point for user registration
app.post('/signup',async (req,res)=> {

        let check = await Users.findOne({email:req.body.email});
        if(check) {
            return res.status(400).json({success:false,errors:"existing user found!"})
        }
        let cart = {};
        for (let i = 0;i<300;i++){
            cart[i]=0;
        }
        const user = new Users({
            name:req.body.username,
            email:req.body.email,
            password:req.body.password,
            cartData:cart,
        })
        await user.save();

        const data={
            user:{
                    id:user.id
                }
            }

        const token = jwt.sign(data,'secret_ecom')
        res.json({success:true,token})
})

// CReating A user login
app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user) {
        const passComapare = req.body.password === user.password;
        if(passComapare) {
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token})
        }
        else{
            res.json({success:false,errors:"Wrong password"});
        }
    }
    else{
        res.json({success:false,errors:"wrong email id"});
    }
})

//creating for new collections data
app.get('/newcollections',async(req,res)=>{
    let products = await Product.find({});
    let newcollections = products.slice(1).slice(-8);
    console.log("newcollections");
    res.send(newcollections);
})

// creating popular section

app.get('/popular',async(req,res)=>{
    let products = await Product.find({category:"building Material"});
    let pop = products.slice(0,4);
    console.log("popular category");
    res.send(pop);
})

//create a middleware for user
const fetchUser = async(req,res,next)=>{
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).send({erros:"Please auth using valid token"})
    }
    else{
        try{
            const data= jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        }catch(error){
            res.status(401).send({errors:"please auth using valid token"})
        }
    }
}

//create for the cart items
app.post('/addtocart',fetchUser,async(req,res)=>{
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] +=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.json({ success: true, message: "Added" });
})

//create for remove cartitem
app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.json({ success: true, message: "Removed" });
})

//create for getting all data for the cart
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("Getcart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})


app.listen(port,(error)=>{
    if(!error){
        console.log("Server is running on port:"+ port)
    }
    else{
        console.log("Error: "+error)
    }
})
