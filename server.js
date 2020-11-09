const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017/mongochat';
var collection;

const path =require('path')
const http = require('http') // bring int the socket
const express =require('express')
const socketio=require('socket.io')



const formatMessage = require('./utils/messages') //import the message format from utils
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users')

const botName='ChatApp Bot'

const app =express()
const server =http.createServer(app)
const io = socketio(server)



//set static folder
app.use(express.static(path.join(__dirname,'public')))


const client = new MongoClient(uri, { useUnifiedTopology: true });
client.connect(err => {
   
    
   
    

    //to run when a client connect so need to be handle in the html file(1)
    io.on('connection',socket=>{
        //create dbcollection
        collection = client.db("mongochat").collection("chats");

        //join room for each technologie
        socket.on('joinRoom',({username,room})=>{
            const user=userJoin( socket.id,username,room)

            socket.join(user.room)
            
            //console.log('new connection..')
        //emit a message when client log in for a single client connecting
        socket.emit('message',formatMessage(botName,'welcome to Nadchart')); //(2)


        //broadcast message when a user connects to all other ecxet the one connecting
        //socket.broadcast.emit('message',formatMessage(botName,'A user has joined the tchat'))
        socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the tchat `))

            //send user and room infos
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room)
            })

        });
        
        //run when user disconnect
        socket.on('disconnect',()=>{
            const user = userLeave(socket.id)
            if (user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username}A user has left the tchat`))
        
            //send user and room infos
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room)
            })
        }
        

        });
        socket.on('chatMessage',function(msg){
            //let name= msg.name
            //letmessage= msg.message
            //let time= msg.time
            //collection.insert({name:name, message:message, time:time}, function(){...})

            const user= getCurrentUser(socket.id)
            let message=formatMessage(user.username,msg)

            collection.insert({message},function(){
                io.to(user.room).emit('message',formatMessage(user.username,msg))
            })
            
        })

    })



console.log('connected to mongodb....')
})
const PORT = 3000|| process.env.PORT
//app.listen(PORT,()=>console.log(`server running on port ${PORT}`))
server.listen(PORT,()=>console.log(`server running on port ${PORT}`))