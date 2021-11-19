const db = require('../db/db');

require('dotenv').config();

/* Postgresクラス */
class PostgresManager {

    /**
     * Poolからclientを取得
     * @return {Promise<void>}
     */
    async init() {
console.log('init');
console.log('host: '+process.env.ENV_HOST);
console.log('database: '+process.env.ENV_DB);
console.log('user: '+process.env.ENV_USER);
console.log('password: '+process.env.ENV_PASS);
        this.client = await db.pool.connect();
    }

    /**
     * SQLを実行
     * @param query
     * @param params
     * @return {Promise<*>}
     */
    async execute(query, params = []) {
        return (await this.client.query(query, params));
    }

    /**
     * 取得したクライアントを解放してPoolに戻す
     * @return {Promise<void>}
     */
    async release() {
        await this.client.release(true);
    }

    /**
     * Transaction Begin
     * @return {Promise<void>}
     */
    async begin() {
        await this.client.query('BEGIN');
    }

    /**
     * Transaction Commit
     * @return {Promise<void>}
     */
    async commit() {
        await this.client.query('COMMIT');
    }

    /**
     * Transaction Rollback
     * @return {Promise<void>}
     */
    async rollback() {
        await this.client.query('ROLLBACK');
    }
}

/**
 * Postgresのインスタンスを返却
 * @return {Promise<Postgres>}
 */
const getClient = async () => {
console.log('getClient');
    const postgres = new PostgresManager();
    await postgres.init();
    return postgres;
};

module.exports.getPostgresClient = getClient;
