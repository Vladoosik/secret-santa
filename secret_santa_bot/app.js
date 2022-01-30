const TelegramBot = require("node-telegram-bot-api")
const token = "5230401337:AAH-S9km97PUrr7W2MlHr-Q6wcn8Wh_pFXU"
const bot = new TelegramBot(token,{polling:true})

let  players = {}
let  game = false



//Check in - начало
bot.onText(/check[ -]in/i,(msg,match)=>{

    if (game)
        return bot.sendMessage(msg.chat.id, msg.chat.username+ "Sorry, but game just started and composition can't be changed")

    players[msg.chat.id] = {
        name: msg.chat.username,
        id:msg.chat.id,
        friend: null
    }
    console.log(players)
    bot.sendMessage(msg.chat.id, "Grats ! You are in game " + msg.chat.username)
})
//Check in - конец

//check out - начало
bot.onText(/check[ -]out/i,(msg,match)=>{

    if (game)
        return bot.sendMessage(msg.chat.id, msg.chat.username+ " Sorry, but game just started and composition can't be changed")

    delete players[msg.chat.id]

    console.log(players)

    bot.sendMessage(msg.chat.id, "Game Over!")
})
//check out - конец


//start game - начало
bot.onText(/start[ -]game/i,(msg,match)=>{

    if (game)
        return bot.sendMessage(msg.chat.id, "Game already started")

    let pl = Object.values(players)

    //кол-во игркоков от 3 до 500 - начало
    if (pl.length<3 || pl.length > 500)
        return bot.sendMessage(msg.chat.id, "Players "+pl.length+", must be more than 3 and less than 500")
    //кол-во игркоков от 3 до 500 - конец

    //нельзя входить и выходить
    game = true

    //жеребьевка
    pl.reduce((prev_player, current_player)=>{

        current_player.friend = {...prev_player}
        bot.sendMessage(current_player.id,
            "You are secret santa for @"+current_player.friend.name)
        return {...current_player}
    },pl[pl.length -1])

})
//start game - конец

bot.onText(/stop[ -]game/i,(msg,match)=>{
    game = false
    players = {}
    bot.sendMessage(msg.chat.id, "Game stopped")
})




bot.onText(/hello (.*)/i,(msg,match)=>{
    console.log({
        chat:msg.chat.id,
        user:msg.chat.username,
        match:match[0]
    })

    bot.sendMessage(msg.chat.id, "Ahoy dude",{
        "reply_markup":{
            "inline_keyboard":[
                ['Check out'],
                ['start game']
            ]
        }

    })

})


