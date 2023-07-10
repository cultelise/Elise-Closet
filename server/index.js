require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./util/database');
const { SERVER_PORT } = process.env;
const multer = require('multer');

const { register, getAllUsers } = require('./controllers/auth');
const { test, test2, uploadImage } = require('./controllers/test');
const { addGarment, getAllGarments } = require('./controllers/garment');
const { getTags } = require('./controllers/tag');
const { User } = require('./models/user');
const { Tag } = require('./models/tag');
const { Garment } = require('./models/garment');

const upload = multer({ dest: 'temp/' });

const app = express();

app.use(express.json());
app.use(cors());

const Garment_Tag = sequelize.define('Garment_Tag', {}, { timestamps: false });
Garment.belongsToMany(Tag, { through: Garment_Tag });
Tag.belongsToMany(Garment, { through: Garment_Tag });

app.get('/test', test);
app.get('/test2', test2);
app.post('/test', upload.single('file'), uploadImage);
app.get('/', getAllUsers);
app.post('/', register);

app.get('/garment', getAllGarments);
app.post('/garment', addGarment);
app.delete('/garment', async (req, res) => {
	const destroy = await Garment.destroy({
		where: {},
	});
	res.send(200).send(destroy);
});

app.get('/tag', getTags);

sequelize.sync().then((res) => {
	console.log(res);
	app.listen(SERVER_PORT, () => {
		console.log('listening on port', SERVER_PORT);
	});
});
