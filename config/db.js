import mysql from 'mysql'
import fs from 'fs'
import { join } from 'path'

export const PARCEL_TYPES = [
  '',
  'meunier',
  'chardonnay',
  'pinot noir',
]

const database = JSON.parse(fs.readFileSync(join(__dirname, 'database-local.json'), 'utf8'))

database.connection.database = 'vigne'

export const createConnection = () => {
  const connection = mysql.createConnection(database.connection)
  connection.connect()
  return connection
}
