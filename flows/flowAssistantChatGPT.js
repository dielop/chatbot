const { readFileSync } = require("fs");
const { join } = require("path");
const { addKeyword } = require('@bot-whatsapp/bot')

const delay = (ms) => new Promise((res => setTimeout(res,ms)));

/** Get Prompt **/

const getPrompt = async () => {
    const pathPromp = join(process.cwd(), "prompts");
    const text = readFileSync(join(pathPromp, "asistente_01.txt"), "utf-8");
    return text;
}

/** Obtengo los menues **/

const getMenu = async () => {
    const pathMenu = join(process.cwd(), "menuStorage");
    const menuText = readFileSync(join(pathMenu,"menu_plantado.txt"), "utf-8");
    return menuText;
}

/**
 * Exportamos
 * @params {*} chatgpt
 */

module.exports = {
        flowChatGPT: (chatGPT) => {
        return addKeyword("chat").addAction(
            async(ctx, {endFlow, flowDynamic, provider}) => {
                await flowDynamic("Consultando en la base de datos...");

                const jid = ctx.key.remoteJid;
                const refProvider = await provider.getInstance();

                await refProvider.presenceSubscribe(jid);
                await delay(500);

                const data = await getPrompt();

                const confirmacionChatGPT = await chatGPT.handleMsgChatGPT(data);
                flowDynamic(confirmacionChatGPT);

                const textFromAI = await chatGPT.handleMsgChatGPT(
                    lista_de_menu="0001    Cortes de carne     Asado de res con salsa  $990, Lomo de res $890, Suprema de pollo $750, Pesca del dia $750, Salmon rosado $920"
                );
                await flowDynamic(textFromAI.text);
            }).addAnswer(
                `Tienes otra consulta?`,
                { capture:true },
                async (ctx, { fallback }) => {
                    // ctx.body es lo que la persona escribe
                    const textFromAI = await chatGPT.handleMsgChatGPT(ctx.body);

                    if(!ctx.body.toLowerCase().includes(['Si'])){
                        await fallback(textFromAI.text);
                    }
                }
            );
    }
}