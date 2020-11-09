
const chatForm = document.getElementById('chat-form') //to access the tchat form
const  chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const usersList = document.getElementById('users')


//get username and room from url
const { username, room}= Qs.parse(location.search,{
    ignoreQueryPrefix:true
    
})

const socket =io()

//join chatRoom
socket.emit('joinRoom',{username,room})
//get room and users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users)

})

//get message from server here and output it to clients (1)(2) 
socket.on('message',message =>{ //message catch here  from server(1)
    console.log(message) // log out here in client console but we want 
    //the message to view by everyone in the tchat html(2)
    outputMessage(message)

    //Scroll down to were the message is everytime a new message get added
    chatMessages.scrollTop= chatMessages.scrollHeight;

})

//creating event listener for submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()  //to prevent the event to be submit to a file  
    //cause by default , submit will send data to a file 
    const msg = e.target.elements.msg.value //so here we get the message text
    //console.log(msg) // and print that to console

    socket.emit('chatMessage',msg)//here we emit the message to server need to be catch in server.js

     //clear input text after submit a message 
     e.target.elements.msg.value='';
     e.target.elements.msg.focus();
})

//output message to DOM
function outputMessage(message){
    const div = document.createElement('div'); //we create a new div to put the message there
    div.classList.add('message') // add a new div with classmessage <div class="message">
    //put the {message} parameter in the paragraph
    //then add the text propety to get the text field ${message.text}
    //add the time propety to get the actual time a message is send ${message.time}
    //addthe username propety too ${message.username}
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    //now we append the div to the div class chat-messages
    document.querySelector('.chat-messages').appendChild(div); 

}
// add room name to dom
function outputRoomName(room){
    roomName.innerText=room
};

//output users connected to dom
function outputUsers(users){
    usersList.innerHTML=`
    ${users.map(user=>`<li> ${user.username}</li>`).join('')}
    `;
}

