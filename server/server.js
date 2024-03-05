const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mysql = require('mysql2');

app.use(express.json())
app.use(cors());

const db= mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
})

// app.post('/signup', (req, res) => {
//     const sql = "INSERT INTO login (`name`,`email`,`password`) VALUES (?)";
//     const values = [
//         req.body.name,
//         req.body.email,
//         req.body.password
//     ]
//     db.querry(sql, [values], (err, data) => {
//         if(err) {
//             return res.json("Error");
//         }
//         return res.json(data);
//     })
// })

// app.post('/login', (req, res) => {
//     const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";
//     db.querry(sql, [req.body.email,req.body.password], (err, data) => {
//         if(err) {
//             return res.json("Error");
//         }
//         if(data.length > 0) {
//             return res.json("Success");
//         } else {
//         return res.json(data);
//     }
// })
// })

app.listen(8080, ()=> {
    console.log("listening");
})

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);



const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

io.on("connection", (socket) => {
    console.log(`User Connected, id is ${socket.id}`);
    socket.emit("price", 450); //Price will come from Db
    socket.on("newAcceptedBid", (data) => {
        //Update Db with the new bid "(data)", and emit to other browsers.
        socket.broadcast.emit("price", (data));
    });
})

server.listen(PORT, () => {
    console.log("Server running");
})