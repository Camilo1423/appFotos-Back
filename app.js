const  dotenv = require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require("mongoose")

// inicializar la instacia de express
const app = express();

// midelwere morgan
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


const {Client, LocalAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({authStrategy: new LocalAuth({
    clientId: 'client-oasis',
    dataPath: './session.json'
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

client.initialize();

// importacion de rutas
const { userRoute, clientRoute, dayRoute } = require('./src/routes/routes.js')
const { dbConect } =  require('./src/helpers/conectDB.js')

dbConect()


//TODO: Crear los demas endpoints de la aplicación
// inicializacion de los endpoints
const { Clientes } = require("./src/models/index.js")

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
