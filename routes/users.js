var express = require('express');
var router = express.Router();
const {MongoClient,dburl,mongodb} = require('../dbSchema');
const {hashedpassword, hashcompare, createtoken, verifytoken} = require('../auth');
const {sendEmail} = require('../nodemailer');
const {nanoid} = require('nanoid');



router.post('/register', async(req,res)=>{
  const client= await MongoClient.connect(dburl);
  try {
    const db = await client.db('users');
    const users = await db.collection('Markdown_viewer').find({email:req.body.email}).toArray();

    if(users.length>0){
      res.json({
        statuscode : 400,
        message :'user already registered'})
    }
    else{
      let pwd = req.body.password; 
      let hashedpwd = await hashedpassword(req.body.password);  
      req.body.password = hashedpwd;
//       req.body.status = "not Verified";

//       //create token , shorturl
//       let url= 'http://localhost:3000/verify?id=';
      
      let token = createtoken(req.body.name,req.body.email,req.body.phone,pwd)
      .then(data=>req.body.token = data);
//       .then(data=> data=nanoid(10))
//        .then(data=>{console.log('short=',data);
//         req.body.id=data;
//         sendEmail(url+data);})

    let document = await db.collection('Markdown_viewer').insertOne(req.body);  
       
      res.json({
        statuscode : 200,
        message : 'user registered successfully',
//         status : 'inactive',
        data : document,
       })
      }
  }catch(error){console.log(error);}
})

// //get token parameters
// router.get('/verify', async(req,res)=>{
//   const client= await MongoClient.connect(dburl);
//   const db = await client.db('users');
//   // console.log(req.query.id);
//   if(req.query.id.length==10){
//   let document = await db.collection('Markdown_viewer').findOne({id:req.query.id})
  
//   if(document){
//   res.json({
//     statuscode : 200,
//     token: document.token,
//     name : document.name,
//     email : document.email
//   })
//   }
//   else{
//     res.json({
//       statuscode : 404,
//       message : "url Expired"
//     })
//   }
//   }
  
// })



// //Verification
// router.get('/verifyuser', async(req,res)=>{
//   if(req.query.token.length > 10){
//    let decode = await verifytoken(req.query.token);
//    console.log(decode);
//   const client= await MongoClient.connect(dburl);
//   const db = await client.db('users');
//    let document = await db.collection('Markdown_viewer').findOne({email: decode.email});
//   // let document = await db.collection('task').findOne({token:req.query.token})
//    console.log({document});

//   if (document) {
    
//     let update= await db.collection('Markdown_viewer').updateOne({email: document.email},
//       { $set: {name : document.name,email : document.email, phone:document.phone, id: document.id, token: document.token, status:"verified"} })
//     res.json({
//       statuscode: 200,
//       token : document.token,
//     })
//   }
//   else{
//     res.json({
//       statuscode: 400,
//       message : "Invalid key"
//     })
//   }
// }
})



//Login
router.post('/login', async (req, res) => {
  const client = await MongoClient.connect(dburl);
  
  try{
    const db = await client.db('users');
  let user = await db.collection('Markdown_viewer').findOne({email: req.body.email})
  
  if(user){
    console.log(user);
    let compare = await hashcompare(req.body.password,user.password);
    if(compare){
//       if(user.status=='verified'){
      res.json({
        statuscode: 200,
        message: "login successful"
      })
//     }
//     else{
//       res.json({
//         statuscode: 404,
//         message : "user not verified"
//       })
//     }
    }
    else{
      res.json({
        statuscode: 400,
        message: "Invalid password"
      })
    }
  }
  else{
    res.json({
      statuscode : 408,
      message : 'user not found'
    })
  }
}catch(error){console.log(error)}
finally{client.close();}
})

//get daetails of user
router.post('/getdetails',async (req,res)=>{
  const client= await MongoClient.connect(dburl);
  const db = await client.db('users');
  let document = await db.collection('Markdown_viewer').findOne({email:req.body.email});
  res.json({
    statuscode : 200,
    userDetails: document
  })
})

//Forgot password
router.post('/forgotpassword',async(req,res)=>{
  const client= await MongoClient.connect(dburl);
  const db = await client.db('users');
  let document = await db.collection('Markdown_viewer').findOne({email:req.body.email});
  
  if(document){
   
  if(document.phone===req.body.phone && document.name===req.body.name ){
   
//     let url= 'http://localhost:3000/verify?id=';
    let token = await createtoken(req.body.name,req.body.email,req.body.phone,req.body.newpassword)
    .then(data=>req.body.token = data)
//     .then(data=>data=nanoid(10))
//       .then(data=>{
//         req.body.id=data;
//         sendEmail(url+data);})
    
    let hashedpwd = await hashedpassword(req.body.newpassword);
    
    let update= await db.collection('Markdown_viewer').updateOne({email: req.body.email},
      { $set: {name : req.body.name,email : req.body.email, phone:req.body.phone,password:hashedpwd, id:req.body.id, token:req.body.token} });                 
    
    res.json({
      statuscode:200,
      message:'forgotpassword',
      update
    })
  }else{
    res.json({
      statuscode:400,
      message:'Invalid credentials'
    })
  }
  }
  else{
    res.json({
      statuscode:404,
      message : 'Email doesnot registered'
    })
  }
})

router.post('/uploadfile', (req, res)=>{
  
})
module.exports = router;

