const { addKeyword } = require("@bot-whatsapp/bot");

const flowPrincipal = addKeyword(['caca', 'menu'])
    .addAnswer("Bienvenido a *Hyatt Hotel*")
    .addAnswer("Envie 'chat' para comunicarse con chatgpt");

module.exports = flowPrincipal;