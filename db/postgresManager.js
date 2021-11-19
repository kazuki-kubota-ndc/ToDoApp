const db = require('../db/db');

/* Postgres�N���X */
class PostgresManager {

    /**
     * Pool����client���擾
     * @return {Promise<void>}
     */
    async init() {
console.log('init');
        this.client = await db.pool.connect();
    }

    /**
     * SQL�����s
     * @param query
     * @param params
     * @return {Promise<*>}
     */
    async execute(query, params = []) {
        return (await this.client.query(query, params));
    }

    /**
     * �擾�����N���C�A���g���������Pool�ɖ߂�
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
 * Postgres�̃C���X�^���X��ԋp
 * @return {Promise<Postgres>}
 */
const getClient = async () => {
console.log('getClient');
    const postgres = new PostgresManager();
    await postgres.init();
    return postgres;
};

module.exports.getPostgresClient = getClient;
