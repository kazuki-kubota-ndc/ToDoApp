const db = require('../db/db');

/* Postgresクラス */
class PostgresManager {

    /**
     * Poolからclientを取得
     * @return {Promise<void>}
     */
    async init() {
console.log('init');
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
