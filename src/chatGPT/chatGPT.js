require('dotenv').config();

// Flujo chatGPT generico ...
const flowChatGPT = async (req,res, openai) => {
    let tag = req.body.fulfillmentInfo.tag;
    let query = req.body.text;

    /*contexto = 'Actua como recepcionista del Hotel Hyatt Centric Montevideo, por favor, responda de manera cortés y si es la primera vez que hablan, saludalo.' +
               'En base a lo que te consulta, si tienes la información proporcionala. Si no sabes la respuesta, pidele que reformule la pregunta. Si no quiere hablar mas, saludalo.';*/

    /* const today = new Date();
    contexto = today.toLocaleTimeString('es-AR'); 
    console.log(contexto); */

    if(tag === 'chatgpt'){
        let result = await textGeneration(query,openai);
        //const parsedResponse = JSON.stringify(result, null, 2);
        if(result.status == 1) {
            res.send(formatResponseForDialogFlow(
                [
                    result.response
                ],
                '',
                '',
                ''
            ));
        }else{
            res.send(getErrorMessage());
        }
    }else{
        res.send(
            formatResponseForDialogFlow(
                [
                    'Esto es desde el webhook',
                    'No hay un intents para esta pregunta'
                ],
                '',
                '',
                ''
            )
        );
    }
}

// flujo chatGPT servicios ...
const flowServiciosGPT = async (req,res, openai) => {
    let tag = req.body.fulfillmentInfo.tag;
    let query = req.body.text;

   /* contexto = 'Actua como recepcionista del Hotel Hyatt Centric Montevideo, por favor, responda de manera cortés y si es la primera vez que hablan, saludalo.' +
               'En base a lo que te consulta, si tienes la información proporcionala. Puedes comentarles los servicios, en base a la pagina web del hotel. Si no sabes la respuesta, pidele que reformule la pregunta.' +
               'Si no quiere hablar mas, saludalo.';*/

    if(tag === 'serviciosChatgpt'){
        let result = await textGeneration(query, openai);
        //const parsedResponse = JSON.stringify(result, null, 2);
        if(result.status == 1) {
            res.send(formatResponseForDialogFlow(
                [
                    result.response
                ],
                '',
                '',
                ''
            ));
        }else{
            res.send(getErrorMessage());
        }
    }else{
        res.send(
            formatResponseForDialogFlow(
                [
                    'Esto es desde el webhook',
                    'No hay un intents para esta pregunta'
                ],
                '',
                '',
                ''
            )
        );
    }
}

// Envio de contexto y prompt chatGPT
const textGeneration = async (prompt, openai) => {
    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `Human:${prompt}\nAI:`,
            temperature: 0.5,
            max_tokens: 1000,
            top_p:1,
            frequency_penalty: 0.4,
            presence_penalty: 0.6,
            stop: ['Human:', 'AI:']
        });

        return{
            status:1,
            response: `${response.data.choices[0].text}`
        };
    } catch (error) {
        return {
            status:0,
            response: ''
        };
    }
}

// formatear respuesta a dialog flow ... 
const formatResponseForDialogFlow = (texts, sessionInfo, targetFlow, targetPage) => {
    messages = []

    texts.forEach(text => {
        messages.push(
            {
                text: {
                    text: [text],
                    redactedText: [text]
                },
                responseType: 'HANDLER_PROMPT',
                source: 'VIRTUAL_AGENT'
            }
        );
    });

    let responseData = {
        fulfillment_response: {
            messages: messages
        }
    };

    if (sessionInfo !== '') {
        responseData['sessionInfo'] = sessionInfo;
    }

    if (targetFlow !== '') {
        responseData['targetFlow'] = targetFlow;
    }

    if (targetPage !== '') {
        responseData['targetPage'] = targetPage;
    }

    return responseData
};    

// mensajes de error chatgpt ...
const getErrorMessage = () => {
        return formatResponseForDialogFlow([
            'No logramos encontrar una respuesta acorde a su pregunta. Vuelva a preguntarnos.'
        ],
        '',
        '',
        ''
    );
};


module.exports = {
    flowChatGPT,
    flowServiciosGPT
};