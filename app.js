const express = require('express');
const morgan = require('morgan');
const exphbs  = require('express-handlebars');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configuración del motor de vistas Handlebars
app.engine('handlebars', exphbs(
    {
        layoutsDir: path.join(__dirname, 'views/'),
        defaultLayout: 'home',
    }
));
app.set('view engine', 'handlebars');

// Configuración del middleware Morgan para mostrar logs en la consola
app.use(morgan('dev'));

// Configuración de Multer para manejar la carga de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Directorio donde se guardarán los archivos
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Configuración para servir archivos estáticos desde la carpeta 'public'
app.use('/public', express.static('public'));

// Ignorar las solicitudes de favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204));

// Ruta para servir la página principal con el carrusel de fotos
app.get('/', (req, res) => {
    // Obtén la lista de imágenes en la carpeta de uploads
    const photos = fs.readdirSync('./public/uploads');
    
    // Renderiza la página principal con la lista de imágenes
    res.render('home', { photos });
});

// Ruta para manejar la carga de imágenes
app.post('/upload', upload.single('photo'), (req, res) => {
    // Después de subir la nueva imagen, redirige a la página principal
    res.redirect('/');
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`El servidor está escuchando en http://raspberrypi.local:${port}`);
});
