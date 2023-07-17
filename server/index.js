const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
//para criptografar a senha
const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"password",
    database:"usuarios"

})

app.use(express.json());
app.use(cors());

app.post("/register", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query("SELECT * FROM usuarios WHERE email = ?", [email], 
    (err, res) => {
        if(err){
            res.send(err)
        }
        if(res.length == 0){
            bcrypt.hash(password, saltRounds,  (erro, hash) => {
                db.query(
                    "INSERT INTO usuarios (email, password) VALUES (?, ?)",
                    [email, hash],
                 (err, res) => {
                    if(err){
                        res.send(err);
                    }
                    res.send({msg: "cadastrado com sucesso"});
                 });
            })
            
        }else{
            res.send({msg: "Usuário já cadastrado"})
        } 
    });
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query("SELECT * FROM usuarios WHERE email = ?" [email], 
    (err, response) =>{
        if(err){
            res.send(err);
        }
        if(response.length > 0){
            bcrypt.compare(password, response[0].password, 
                (error, result) =>{
                    if(result){
                        res.send("Usuário logado com sucesso");
                    }else{
                        res.send("Senha incorreta")
                    }
            })
        }else{
            res.send({msg: "Conta não encontrada"})
        }
    })
})

// app.get("/", (req, res) => {
//     db.query("INSERT INTO usuarios (email, password) VALUES ('matheusspasti@gmail.com', '123456789')", ((err, result) => {
//         if(err){
//             console.log(err)
//         }
//     }))
// })

app.listen(3001, () =>  {
    console.log("Rodando na porta 3001")

})

