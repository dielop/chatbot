const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot')
const { flowChatGPT } = require('./flows/flowAssistantChatGPT')
const flowPrincipal = require('./flows/flujoPrincipal')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MySQLAdapter = require('@bot-whatsapp/database/mysql')

/** DialogFlow Essential **/
const { createBotDialog } = require('@bot-whatsapp/contexts/dialogflow')

/** ChatGPT **/
const ChatGPT = require('./chatgpt/chatgpt');
const chatGPT = new ChatGPT();

/**
 * Declaramos las conexiones de MySQL
 */
const MYSQL_DB_HOST = 'localhost'
const MYSQL_DB_USER = 'root'
const MYSQL_DB_PASSWORD = 'sl10672.d'
const MYSQL_DB_NAME = 'bot_baileys'
const MYSQL_DB_PORT = '3306'

const main = async () => {
    const adapterDB = new MySQLAdapter({
        host: MYSQL_DB_HOST,
        user: MYSQL_DB_USER,
        database: MYSQL_DB_NAME,
        password: MYSQL_DB_PASSWORD,
        port: MYSQL_DB_PORT,
    })
    const adapterFlow = createFlow([
        flowPrincipal,
        flowChatGPT(chatGPT)
    ])

    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    createBotDialog({
        provider:adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
