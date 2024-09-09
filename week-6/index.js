import express from 'express';
import jwt from 'jsonwebtoken';
const app = express();
const JWT_SECRET = "Yashwanth14";

app.use(express.json());
let users = []
app.post('/signup',(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    users.push({
        username,
        password
    })
    res.send("Welcome " + username);
    console.log(req.body,'reqbody',users)
})
function auth(req, res, next) {
    const token = req.headers.authorization
    if(token){
        jwt.verify(token,JWT_SECRET,(err,decoded)=>{
            if(err){
                return res.status(403).send({
                    message:"Invalid token"
                })
            }
            req.user = decoded
            next()
        })
    } else {
        res.status(403).send({
            message:"unauthorized"
        })
    }

}
app.post('/signin',(req,res)=>{
    const {username,password} = req.body

    const user = users.find(user => user.username === username && user.password === password)

    if(user){
        const token = jwt.sign({
            username
        },JWT_SECRET,{
            expiresIn:"1h"
        })
        res.send({
            username: "Logged in successfully " + user.username,
            token: token
        })
    } else {
        res.status(403).send({
            message:"Invalid username or password"
        })
    }

    console.log(req.body,'reqbody')
})
app.get('/me',auth,(req,res)=>{
    const  username  = req.user

    // console.log(username,users,'uttt')
    const user = users.find(user => user.username === username.username)
    if(user){
        res.send({
            username: user.username
        })
    } else {
        res.status(403).send({
            message:"user not found"
        })
    }
})
const port = 3000
app.listen(port,()=>console.log(`Listening on port ${port}`));