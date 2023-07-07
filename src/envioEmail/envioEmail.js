/* require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.EMAIL_APIKEY; //clave API de Brevo
const endpoint = 'https://api.brevo.io/mail/send';

const sendEmail = async (to, subject, body) => {
    try{ 
        const response = await axios.post(endpoint, {
            to,
            subject,
            body,
        },{
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('Correo electrónico enviado con éxito:', response.data);
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error.message);
    } 
};

sendEmail('pushit.contacto@gmail.com', 'Asunto del correo', 'Cuerpo del correo');

module.exports = { sendEmail }; */