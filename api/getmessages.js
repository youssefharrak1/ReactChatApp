//import { getConnecterUser, triggerNotConnected } from "../lib/session";
import { Redis } from '@upstash/redis';
import { checkSession, getConnecterUser, unauthorizedResponse } from '../lib/session.js';
// const PushNotifications = require("@pusher/push-notifications-server");

export default async (request, response) => {

    
    try {
        const connected = await checkSession(request);
        if (!connected) {
            console.log("Not connected");
            return unauthorizedResponse();
        }
        const user = await getConnecterUser(request);
        const receiverId = Number(new Headers (request.headers)?.get('ReceiverId'));
        const roomId = Number(new Headers (request.headers)?.get('RoomId'));
        const check = (receiverId, roomId) => {
            if (receiverId) { return receiverId; }
            return roomId;
        }

        const senderId = user.id;
        const check_result = check(receiverId, roomId);
        const getChatKey = (a, b) => {
            const [userA, userB] = [a, b].sort();
            return check_result == receiverId ? `messages:${userA}:${userB}` : `room:${userB}`;

        };
    
        
        const limit = 50;
        const key = getChatKey(senderId, check_result);
        const redis = Redis.fromEnv();
        const messagesData = await redis.lrange(key, 0, limit - 1); // Fetch messages
        const messages = messagesData.map((message) => JSON.stringify(message));
        console.log("messages", messages);
         response.status(200).json({ success: true, messages });
       

    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
};
