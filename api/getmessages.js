//import { getConnecterUser, triggerNotConnected } from "../lib/session";
import { Redis } from '@upstash/redis';
// const PushNotifications = require("@pusher/push-notifications-server");

export default async (request, response) => {
    const redis = Redis.fromEnv();

    async function getConnecterUser(request) {
        let token = new Headers(request.headers).get('Authentication');
        if (token === undefined || token === null || token === "") {
            return null;
        } else {
            token = token.replace("Bearer ", "");
        }
        console.log("checking " + token);
        const user = await redis.get(token);
        console.log("Got user : " + user.username);
        return user;

    }

     function triggerNotConnected(res) {
        res.status(401).json("{code: \"UNAUTHORIZED\", message: \"Session expired\"}");
    }
    
    try {
        
        const user = await getConnecterUser(request);
        if (user === undefined || user === null) {
            console.log("Not connected");
            triggerNotConnected(response);
        }
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
        // Return the messages in a JSON response
        console.log("messages", messages);
        return response.status(200).json({ success: true, messages });
        // TO-DO: get messages. 

    } catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};
