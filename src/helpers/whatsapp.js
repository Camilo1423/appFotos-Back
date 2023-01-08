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
    console.log('Session detectada e iniciada')
});

client.initialize();