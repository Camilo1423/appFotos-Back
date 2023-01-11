const  dotenv = require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require("mongoose")

const { Clientes } = require("./src/models/index.js")

// inicializar la instacia de express
const app = express();

// midelwere morgan
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


const {Client, LocalAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    },
    authStrategy: new LocalAuth({
    clientId: 'client-oasis',
    dataPath: './session'
})})

//generacion del qr
client.on('qr', (qr) => {
    console.log('No se a registrado ninguna sesión')
    qrcode.generate(qr, { small: true });
});

//autenticación de la session registrada
client.on('authenticated', () => {
    console.log('Sesión detectada e iniciada')
});

// client.on('message', async (message) => {
//     if(message.body.toLocaleLowerCase().includes('hol')
//     || message.body.toLocaleLowerCase().includes('link')
//     || message.body.toLocaleLowerCase().includes('tardes')
//     || message.body.toLocaleLowerCase().includes('días')
//     || message.body.toLocaleLowerCase().includes('dias')
//     || message.body.toLocaleLowerCase().includes('noches')
//     ) {
//         client.sendMessage(message.from, `Hola ${message._data.notifyName}, un gusto saludarte, mi nombre es Sofía, seré tu chat bot de ayuda para reclamar tus fotografías.\n\n¿Quieres saber el estado de tus fotografías?\n_Escribe la respuesta como aparece en este mensaje por favor_\n1) Si\n2) No\n\nEspero poderte ser de ayuda`)
//     }
//     if(message.body.toLocaleLowerCase() == 'si'
//     || message.body.toLocaleLowerCase() == 'sí'
//     || message.body.toLocaleLowerCase() == '1'
//     || message.body.toLocaleLowerCase() == '1)'
//     ) {
//         client.sendMessage(message.from, `Genial!! ${message._data.notifyName}, para ayudarte por favor digita el número que registrarte al momento de tomarte las fotografías por favor\n\n*Sin espacios, y tampoco signos especiales*`)
//     }
//     if(message.body.trim().length == 10) {
//         try {
//             const datos = await Clientes.findOne({telefono: {$eq: message.body.trim()}})
//             if(!datos) {
//                 client.sendMessage(message.from, 'Lo sentimos, no tenemos registro de este número. \n\nVerifica que el número este bien escrito, o solicita hablar con un asesor escribiendo: *-asesor*')
//                 return
//             }
//             client.sendMessage(message.from, `Excelentes noticias ${message._data.notifyName} Hemos encontrado un match con ese número`)
//             client.sendMessage(message.from, `Cliente: *${datos.fullName}*\n\nEstado actual de tu orden: *${datos.estado ? 'Fotografías envíadas' : 'En proceso de edicion'}*\n\nPaquete adquirido: *${datos.paquete}*`)
//             datos.estado ? client.sendMessage(message.from, '¿No has recibido tus fotografías?\n\nEscribe el siguiente mensaje: *-reenviar (número del celular registrado)*') : null
//             return
//         } catch (error) {
//             client.sendMessage(message.from, 'Lo sentimos, nuestro servidor está fallando. Intentalo más tarde')
//         }
//     }
//     if(message.body.toLocaleLowerCase().split(' ')[0] == '-reenviar') {
//         try {
//             const datos = await Clientes.findOne({telefono: {$eq: message.body.split(' ')[1]}})
//             client.sendMessage(`57${datos.telefono}@c.us`, `Gracias por tu espera, puedes descargar tus fotografías en el siguiente enlace:\n\n${datos.link}\n\nSino te aparece el link en azul, envianos cualquier mensaje para que whatsapp no nos detecte el chat como spam y habilite el link.\n\n*NOTA:* El link estará habilidato por 7 días, no olvides descargarlas lo antes posible\n\n`)
//             client.sendMessage(message.from, `${message._data.notifyName} hemos reenviado tus fotos correctamente`)
//             return
//         } catch (error) {
//             client.sendMessage(message.from, 'Lo sentimos, nuestro servidor está fallando. Intentalo más tarde')
//         }
//     }
//     if(message.body.toLocaleLowerCase() == 'no'
//     || message.body.toLocaleLowerCase() == '2'
//     || message.body.toLocaleLowerCase() == '2)'
//     ) {
//         client.sendMessage(message.from, '*_Gracias por contactarnos, recuerda que somos Oasis Eco Park_*')
//     }
//     if(message.body.toLocaleLowerCase() == '-asesor') {
//         client.sendMessage(message.from, 'Genial, por el momento tenemos dos agentes en línea: soyAndres o soyLaura, escribe el nombre del asesor que quieres que te contacte')
//     }
//     if(message.body.toLocaleLowerCase() == 'soylaura') client.sendMessage('573108098741@c.us', `Laura, el número ${message.from} está solicitando hablar contigo`)
//     if(message.body.toLocaleLowerCase() == 'soyandres') client.sendMessage('573227923083@c.us', `Andres, el número ${message.from} está solicitando hablar contigo`)
// })

client.initialize();

// importacion de rutas
const { userRoute, clientRoute, dayRoute } = require('./src/routes/routes.js')
const { dbConect } =  require('./src/helpers/conectDB.js')

dbConect()


//TODO: Crear los demas endpoints de la aplicación
// inicializacion de los endpoints


app.use('/send/sendmessage', async (req, res) => {
    const { message, phone } = req.body;
    console.log(message, phone);
    await client.sendMessage(`${phone}@c.us`, message);
    return res.status(200).json({status: 200});
})
app.use('/user', userRoute)
app.use('/client', clientRoute)
app.use('/day', dayRoute)
app.post('/client/register', async (req, res)=> {
    const {fullName, paquete, email, telefono, observaciones, horaInicial, horaFinal, dia, registerDay, medioPago} = req.body;
    try {
        await Clientes.create({fullName, paquete, email, telefono, observaciones, horaInicial, horaFinal, registerDay, medioPago})
        await client.sendMessage(`57${telefono}@c.us`, `Hola ${fullName}, gracias por adquirir nuestro paquete de fotografías #${paquete}, si visitaste el parque el día ${dia}, está es la línea de contacto oficial para las fotografías de Oasis Eco Park , cualquier inquietud o solicitud lo puede hacer por este medío de comunicación. \n\n_*NOTA*_: Nuestros horarios de atención son de 9AM a 5PM, no se atenderan mensajes fuera de este horario. Muchas gracias por su comprensión\n\n_Somos Oasis Eco Park_`);
        return res.status(200).json({status: 200})
    } catch (error) {
        return res.status(500).json({message: error})
    }
})
app.post('/client/sendlink/:id', async (req, res) => {
    const {link, telefono} = req.body
    let id = mongoose.Types.ObjectId(req.params.id)
    try {
        await Clientes.updateOne({_id: {$eq: id}}, {link: link, estado: true})
        await client.sendMessage(`57${telefono}@c.us`, `Gracias por tu espera, puedes descargar tus fotografías en el siguiente enlace:\n\n${link}\n\nSino te aparece el link en azul, envianos cualquier mensaje para que whatsapp no nos detecte el chat como spam y habilite el link.\n\n*NOTA:* El link estará habilidato por 7 días, no olvides descargarlas lo antes posible\n\n`)
        return res.status(200).json({status: 200})
    } catch (error) {
        return res.status(500).json({message: error})
    }
})

module.exports = {
    app
}
