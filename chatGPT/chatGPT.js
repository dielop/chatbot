require('dotenv').config();

class ChatGPT {
    queue = [];
    optionsGPT = { model: "gpt-3.5-turbo-0301" };
    openai = undefined;

    constructor() {
        this.init().then();
    }

    /** Init Function **/

    init = async () => {
        const { ChatGPTAPI } = await import("chatgpt");
        this.openai = new ChatGPTAPI(
            {
                apiKey: process.env.CHATGPT_APIKEY
            }
        );
    };

    /** Send Message to ChatGPT and Request */

    handleMsgChatGPT = async (body) => {
        const interactionChatGPT = await this.openai.sendMessage(body, {
            conversationId : !this.queue.length
                ? undefined
                : this.queue[this.queue.length -1].conversationId,
            parentMessageId: !this.queue.length
                ? undefined
                : this.queue[this.queue.length - 1].id,
        });

        this.queue.push(interactionChatGPT);
        return interactionChatGPT
    };
}

module.exports = ChatGPT;