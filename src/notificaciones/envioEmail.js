const Brevo = require('@getbrevo/brevo');

// Creación de nueva campaña y envio de email ... 
const sendEmail = async (consulta) => {
    const now = new Date();
    const scheduledTime = new Date(now.getTime() + 15 * 1000); // Agregar 10 minutos a la fecha y hora actual
    const scheduledAt = scheduledTime.toISOString(); // Convertir la fecha y hora en formato ISO 8601

    const newCampaignContent = {
        name: 'Nueva Campaña',
        subject: 'Pruebas',
        htmlContent: `<p>Consulta: ${consulta}</p>`,
        sender: {
          name: 'Cala Projects',
          email: 'pruebasdesarollo123@gmail.com'
        },
        recipients: {
          listIds: [2]
        },
        scheduledAt: scheduledAt
    };

    try {
      const envioEmailCampaignsApi = new Brevo.EmailCampaignsApi();
  
      // Crear una nueva campaña de correo electrónico con el contenido especificado
      const response = await envioEmailCampaignsApi.createEmailCampaign(newCampaignContent);
  
      // Verificar si la creación fue exitosa
      if (response && response.data) {
        console.log('Campaña de correo electrónico creada:', response.data);
      } else {
        console.log('La respuesta de la API no contiene los datos esperados:', response);
      }
    } catch (error) {
      console.error('Error al crear la campaña de correo electrónico:', error);
    }
  };

module.exports = { sendEmail };