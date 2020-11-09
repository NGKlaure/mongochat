const moment =require('moment') // to import librairie to print the time
// we want our messages to be formater 
function formatMessage( username,text){
    return {
        username,
        text,
        time:moment().format('h:mm a')
    }

}
module.exports=formatMessage;