require('dotenv').config();
//----------------------libreria leifer---------------------------//
const { createProvider } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MySQLAdapter = require('@bot-whatsapp/database/mysql')
//-------------------servidor, app y apis-------------------------//
const express = require ('express');
const { Configuration, OpenAIApi } = require("openai");
const { flowChatGPT, flowServiciosGPT }  = require('./src/chatGPT/chatGPT');
const { sendEmail } = require('./src/envioEmail/envioEmail.js');
//----------------------------------------------------------------//

// Servidor express
const webApp = express();
webApp.use(express.urlencoded({
    extended: true
}));
webApp.use(express.json());

// puertos
const PORT = process.env.PORT || 6000;

// DialogFlow CX
const { createBotDialog } = require('@bot-whatsapp/contexts/dialogflowcx');

// Inicializamos ChatGPT 
const configuration = new Configuration({
    apiKey: process.env.CHATGPT_APIKEY,
});

const openai = new OpenAIApi(configuration);

// Conexión con MySQL
const MYSQL_DB_HOST = process.env.DB_HOST
const MYSQL_DB_USER = process.env.DB_USER
const MYSQL_DB_PASSWORD = process.env.DB_PASSWORD
const MYSQL_DB_NAME = process.env.DB_NAME
const MYSQL_DB_PORT = process.env.DB_PORT

// Contexto inicial chatGPT ...
async function procesamientoContexto(){
    const plantado = 'https://menu.ddns.net/plantado';
    const moderno = 'https://menu.ddns.net/moderno';
    const deli = 'https://menu.ddns.net/deli';

        let contexto = 'Habla como recepcionista del Hotel Hyatt Centric Montevideo, saluda de manera cortés de acuerdo a la hora actual. Proporciona información basada en la consulta y, si no la sabes, solicita una reformulación. Si no desea continuar, despídete. Información útil: Hotel Hyatt Centric Montevideo ubicado en Montevideo, Uruguay. No respondas otra información que no sea del hotel.' +
        'Dirección: Rambla República del Perú 1479, 11300 Montevideo, Uruguay. Teléfonos de contacto: Tel:+598 2621 1234, Fax:+598 2621 1235. Servicios y amenidades del hotel incluyen: acceso a internet libre, check-in digital, servicio a la habitación, amigable con animales, piscina, gimnasio, restaurante, bar, cafetería, lavandería y conserjes.' + 
        'Horarios de check-in: 03:00pm, horario de check-out: 12:00pm. Horario del Moderno Bar: Lunes a Sábados de 07:00pm a 11:00pm, teléfono: 59826211232. Horario del restaurante Plantado: Desayunos: Lunes a Viernes: 06.30am a 10:30am, sábados y domingos 07:30am a 11:00am, almuerzos: Lunes a Sábados: 12:00pm a 03:00pm, cenas: 07:00pm a 11:00pm.' +
        `Links a las cartas del Plantado: ${plantado}, Moderno: ${moderno} y Deli: ${deli}. Responde con un OK si se entendio todo el contexto.`

        await textGeneration(contexto); 
}

const textGeneration = async (prompt) => {
    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `Context:${prompt} \nAI:`,
            temperature: 0.5,
            max_tokens: 2000,
            top_p:1,
            frequency_penalty: 0.4,
            presence_penalty: 0.6,
            stop: ['Context:', 'AI:']
        });

        console.log({
            status:1,
            response: `${response.data.choices[0].text}`
        });
    } catch (error) {
        return {
            status:0,
            response: ''
        };
    }
}

const main = async () => {
    const adapterDB = new MySQLAdapter({
        host: MYSQL_DB_HOST,
        user: MYSQL_DB_USER,
        database: MYSQL_DB_NAME,
        password: MYSQL_DB_PASSWORD,
        port: MYSQL_DB_PORT,
    })
    
    const adapterProvider = createProvider(BaileysProvider)

    // Inicializo conexión con dialogflow cx ...
    createBotDialog({
        provider:adapterProvider,
        database: adapterDB,
    },
    {
        location: 'us-central1',
        agentId: '533d27f8-8492-4f0a-bf75-84fc4dae459f'
    })

    // flujos chatGPT ...
    webApp.post('/chatgpt', (req, res) => flowChatGPT(req, res, openai));
    webApp.post('/serviciosChatgpt', (req, res) => flowServiciosGPT(req, res, openai));

    // Configuración y flujo de envios de emails
    webApp.post('/enviarNotificacionEmail', (req,res) => {
        const informacion = req.body;
        console.log(JSON.stringify(informacion));
        console.log(ctx);
        return;
    })  

    // log de funcionamiento de puerto ...
    webApp.listen(PORT, ()=> {
        console.log(`Server running at ${PORT}`);
    })

    // QR web ...
    QRPortalWeb()
    
    // Generar contexto ...
    procesamientoContexto();
}

main()
