import { Redis } from '@upstash/redis';
import {checkSession,getConnecterUser,unauthorizedResponse} from "../lib/session.js";

// const PushNotifications = require("@pusher/push-notifications-server");


export default async  (request, response) => {

    try {

        const connected = await checkSession(request);
        if (!connected) {
            console.log("Not connected");
            return unauthorizedResponse();
        }
        const user = await getConnecterUser(request);
        const data = request.body;
        const senderId = user.id;
        const receiverId = Number(data?.receiverId)
        const roomId = Number(data?.roomId)

        const check = (receiverId, roomId) => {
            if (receiverId) { return receiverId; }
            return roomId;
        }

        // console.log("dataMessage :", receiverId);
        // console.log("senderId" , senderId);
        const check_result = check(receiverId, roomId);
        const getChatKey = (a, b) => {
            const [userA, userB] = [a, b].sort();
            return check_result == receiverId ? `messages:${userA}:${userB}` : `room:${userB}`;

        };

        const key = getChatKey(senderId, check_result);
        const timestamp = Date.now();
        const messageData = {
            "senderId": senderId,
            "message": data.message,
            "timestamp": timestamp,
            "username": user.username
        };


        const redis = Redis.fromEnv();
        await redis.rpush(key, JSON.stringify(messageData));

        return response.status(200).json(messageData);


    } 
    catch (error) {
        console.log(error);
         response.status(500).json({ error: error.message });
    }
};
