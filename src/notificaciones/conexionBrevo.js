require('dotenv').config();
const Brevo = require('@getbrevo/brevo');

// conexion con brevo ...
const brevoConnection = async () => {
    try {
      const defaultClient = Brevo.ApiClient.instance;
      const apiKey = process.env.EMAIL_APIKEY;
  
      defaultClient.authentications['api-key'].apiKey = apiKey;
  
      const api = new Brevo.AccountApi();
      const data = await api.getAccount();
      console.log('Conexión API de Brevo exitosa. Retorno:', data);
    } catch (error) {
      console.error('Error al establecer la conexión con Brevo:', error);
    }
};

module.exports = { brevoConnection };