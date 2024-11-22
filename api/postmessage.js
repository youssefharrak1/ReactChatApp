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
            "username" :user.username
        };


        const redis = Redis.fromEnv();
        await redis.rpush(key, JSON.stringify(messageData));
        
        response.status(200).json(messageData);


    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
};
