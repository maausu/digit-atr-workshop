import dotenv from 'dotenv'
dotenv.config()
//PS ei tarttee käyttää ; rivin lopus mut voi käyttää jos huvittaa
import {Client, GatewayIntentBits} from 'discord.js';
import OpenAI from 'openai';

//Luodaan muuttuja cliet
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages /*kanavan viestit*/,
        GatewayIntentBits.GuildMembers, /*kanavan jäsenet*/
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
});

//Alustetaan muuttuja OpenAi
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
})

client.login(process.env.DISCORD_KEY);//Kirjautuu sisään clientille

client.on("messageCreate", async(message) =>{/*Botti herää kun luodaan viesti*/
    console.log(message.content);//Tulostaa viestin sisällön

    const userInput = message.content; //Käyttäjän syöttämä sisältö
    if (!message.author.bot){/*Jos messagen lähettäjä ei ole botti (eli se on mä ite)*/
        const aiResponse = await openai.chat.completions.create({
            messages: [{role: 'user', content: userInput}],
            model: 'gpt-3.5-turbo'
        })//AI vastaa meidän lähettämään viestiin käyttämällä määritettyä turbo-kielimallia

        //client.channels.cache.get(message.channelId).send(userInput)//Lähetetään takaisin sama viesti, harjotus
        client.channels.cache.get(message.channelId).send(aiResponse.choices[0].message.content)//Lähetetään AI:n tarjoama ensimmäinen vastausehdotus (index 0)
    }
});//ps ajaminen tapahtuu kirjottamalla node index.js