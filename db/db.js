const { Pool, Client } = require('pg')
const pool = new Pool();

const getClient = async => {
    const client = new Client({
        user: 'adrian',
        host: '127.0.0.1',
        database: 'adrian',
        password: 'adrian',
        port: 5432,
      })
      return client
}

const performQuery = async (query) => {
    try {
        const client = getClient()
        await client.connect()
        const result = await pool.query(query)
        await client.end()
        return result
    } catch (e) {
        console.log("Could not handle query " +query )
    }
}

const createTable = async (name, primaryKey) => {
    try {
      let query = "CREATE TABLE IF NOT EXISTS "+name+"("+primaryKey+" serial NOT NULL PRIMARY KEY, data jsonb);";
      let result = await performQuery(query);
      query = "CREATE INDEX IF NOT EXISTS n_idx ON " +name+ " USING btree (id);"
      result = await performQuery(query);
      return result;
    } catch(e) {
        console.log("table createion error " + e)
    }
}

const addVarcharColumn = async (table, columnName) => {
    try {
      const result = await performQuery("ALTER TABLE " + table + " ADD COLUMN " + columnName + "  VARCHAR;")
      return result
    } catch (e) {
      console.log("Could not create varchar clumn " + e)
    }
}

const addIntColumn = async(table, columnName) => {
    try {
      const result = await performQuery("ALTER TABLE " + table + " ADD COLUMN " + columnName + "  INTEGER")
    } catch (e) {

    }
}

const insertObject = async (tableName, objectJson, id) => {
    const idValue = id == null ? "DEFAULT" : id 
    console.log("ID VALUE " + idValue);
    try {
        const query =  "INSERT INTO " + tableName +" VALUES ( " + idValue +", '" + objectJson + "' ) ON CONFLICT (id) DO UPDATE SET data = '" + objectJson + "' RETURNING id;"
        const result = await performQuery(query); 
        return result 
    } catch (e) {
        console.log("Could not insert into database " + e)
        return -1
    }
}

const updateObject = async (tableName, objectJson, id) => {
    try {
        const query =  "UPDATE " + tableName + "SET data = " + objectJson + "WHERE id = " + id;
        console.log("update query " + query);
        const result = await performQuery(query);
        return result
    } catch (e) {
        return (e)
        console.log()
    }
}

const getObjects = async (name, start, size) => {
    try {
        const result = await performQuery("SELECT * FROM "+name+" WHERE id > "+ start +" ORDER BY id ASC LIMIT "+size+";");
        return result.rows
    } catch (e) {
        //console.log(e)
        return []
    }
}

const getObject = async (name, id ) => {
  const query = "SELECT * FROM "+name+" WHERE id = "+ id +";";
  console.log(query);
  const res = await performQuery(query);
  return res.rows.length > 0 ? res.rows[0] : null
}

const getObjectsWhere = async (name, whereCause ) => {
    try {
        const query = "SELECT * FROM "+name+" WHERE data @> "+ whereCause +";";
        console.log(query);
        const res = await performQuery(query);
        return res.rows
    } catch(e) {
        return []
    }
}

const getObjectWhere = async (name, whereCause ) => {
    let results = await this.getObjectsWhere(name, whereCause);
    if(results != null) {
        return results[0]
    } else {
        return null
    }
  }


module.exports = {
  query: (text, params) => pool.query(text, params),
  createTable,
  addVarcharColumn,
  addIntColumn, 
  insertObject,
  getObjects,
  getObject,
  updateObject,
  getObjectWhere,
  getObjectsWhere
}