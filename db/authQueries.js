import pool from "./pool.js";

async function initializeUsers() {
    const check = await pool.query(`
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = 'public'
                AND table_name = 'users'
        );
        `);

    if (!check.rows[0].exists) {
        console.log("users table doesn't exist, creating now");
    }

    const tableCreated = await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            first_name TEXT,
            last_name TEXT,
            username TEXT,
            password_hash TEXT,
            salt TEXT
        )
        `);
}

async function initializeMessages() {
    const check = await pool.query(`
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = 'public'
                AND table_name = 'messages'
        );
        `);

    if (!check.rows[0].exists) {
        console.log("messages table doesn't exist, creating now");
    }

    const tableCreated = await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            userId INTEGER REFERENCES users(id),
            title TEXT,
            timestamp TEXT,
            text TEXT
        )
        `);
}

async function initializeSessionTable() {
    const check = await pool.query(`
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = 'public'
                AND table_name = 'session'
        );
        `);

    if (!check.rows[0].exists) {
        console.log("users table doesn't exist, creating now");

        const tableCreated = await pool.query(`
        CREATE TABLE "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
        )
        WITH (OIDS=FALSE);

        ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

        CREATE INDEX "IDX_session_expire" ON "session" ("expire"); 
        `);
    }
}

async function checkUserExists(username) {
    const { rows } = await pool.query(
        `
        SELECT * FROM users
        WHERE username = $1;
        `,
        [username]
    );
    return !!rows[0];
}

async function addUser(username, password) {
    await pool.query(
        `
        INSERT INTO users (username, password_hash)
        VALUES ($1, $2)
        `,
        [username, password]
    );
}

async function getUser(username) {
    return await pool.query(
        `
        SELECT * FROM users
        WHERE username = $1
        `,
        [username]
    );
}

async function getUserById(id) {
    return await pool.query(
        `
        SELECT * FROM users
        WHERE id = $1
        `,
        [id]
    );
}

/*
===== EXAMPLE FUNCTION =======================
async function getAllPosts() {
    const { rows } = await pool.query("SELECT * FROM posts");
    return rows;
}
*/

export default {
    initializeUsers,
    initializeMessages,
    initializeSessionTable,
    checkUserExists,
    addUser,
    getUser,
    getUserById,
};
