import express from 'express';
const app = express();
const GlobalArr = []
app.use(express.json());
function generateToken() {
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let token = "";
    for (let i = 0; i < 32; i++) {
        // use a simple function here
        token += options[Math.floor(Math.random() * options.length)];
    }
    return token;
}
app.post('/signup',(req,res)=>{
    console.log(req.body,'reqbody')
    const username = req.body.username
    const password = req.body.password

    if(username && password){
        GlobalArr.push({
            username,
            password
        })
        res.send("Welcome " + username)

        console.log(GlobalArr)

    }else{
        res.send("Please enter username and password")
    }
})

app.post('/signin',(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    
    if(username && password){
        GlobalArr.forEach((user)=>{
            if(user.username === username && user.password === password){
                const token = generateToken()
                user.token = token
                console.log(GlobalArr,'g')
                res.send(
                    {

                        "token": token
                    }
                )
                // res.json({"welcome back:": username})
            }
        })
    
    }else{
        res.status(403).send("Invalid username and password")
    } 
})

app.listen(3000)
