import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function getConnecterUser(request) {
    let token = new Headers(request.headers).get('Authentication');
    if (token === undefined || token === null || token === "") {
        return null;
    } else {
        token = token.replace("Bearer ", "");
    }
    console.log("checking " + token);
    const user = await redis.get(token);
    const ttl = await redis.ttl(token); 
    if (ttl>0){
        console.log("Got user : " + user.username);
        return user;
    }
    else{
        console.log("token expired")
    
        return null;
    }
}

export async function checkSession(request) {
    const user = await getConnecterUser(request);
    // console.log(user);
    return (user !== undefined && user !== null && user);
}

export function unauthorizedResponse() {
    const error = {code: "UNAUTHORIZED", message: "Session expired"};
    return new Response(JSON.stringify(error), {
        status: 401,
        headers: {'content-type': 'application/json'},
    });
}

export function triggerNotConnected(res) {
    res.status(401).json("{code: \"UNAUTHORIZED\", message: \"Session expired\"}");
}  