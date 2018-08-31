import mysql from 'mysql';

export const PARCEL_TYPES = [
	'',
	'meunier',
	'chardonnay',
	'pinot noir'
];

const HOST = 'localhost';
const USER = 'root';
const PASSWORD = 'neo&100s';
const DATABASE = 'vigne';

export const createConnection = () => {
	const connection = mysql.createConnection({
		host: HOST,
		user: USER,
		password: PASSWORD,
		database: DATABASE
	})
	connection.connect();
	return connection;
};


