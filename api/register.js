import { db } from '@vercel/postgres';
import { Redis } from '@upstash/redis';
import { arrayBufferToBase64, stringToArrayBuffer } from "../lib/base64";

export const config = {
    runtime: 'edge',
};

const redis = Redis.fromEnv();

export default async function handler(request) {
    try {
        // Get the data from the request body
        const { username, email, password } = await request.json();

        // Generate external_id and get current timestamp
        const created_on = new Date(); // Current timestamp
        const external_id = crypto.randomUUID(); // Correct randomUUID usage

        // Hash the password using SHA-256 (for now, but consider using bcrypt for password hashing)
        const hash = await crypto.subtle.digest('SHA-256', stringToArrayBuffer(username + password));
        const hashed64 = arrayBufferToBase64(hash);

        // Connect to the database
        const client = await db.connect();

        // Perform the insert query to add the user into the database
        const { rowCount, rows } = await client.sql`
            INSERT INTO users (username, password, email, created_on, external_id)
            VALUES (${username}, ${hashed64}, ${email}, ${created_on}, ${external_id})
            RETURNING *;
        `;

        // Check if the user was successfully inserted
        if (rowCount > 0) {
            const createdOn = rows[0].created_on;
            console.log('User created on:', createdOn);
            await client.sql`update users set last_login = now() where user_id = ${rows[0].user_id}`;
            const token = crypto.randomUUID().toString();
            const user = { id: rows[0].user_id, username: rows[0].username, email: rows[0].email, externalId: rows[0].external_id }
            await redis.set(token, user, { ex: 3600 });
            const userInfo = {};
            userInfo[user.id] = user;
            await redis.hset("users", userInfo);

            return new Response(JSON.stringify({ token: token, username: username, externalId: rows[0].external_id, id: rows[0].user_id })
            ,{
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        } else {
            console.error('Insert failed.');
            return new Response(JSON.stringify({ message: 'Failed to create user' }), {
                status: 500,
                headers: { 'content-type': 'application/json' },
            });
        }
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({
            message: 'An error occurred while registering the user',
            details: error.message || 'Unknown error'
        }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}
