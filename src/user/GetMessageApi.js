export function getMessage(receiverId,token,onResult, onError) {
fetch("/api/getmessages", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authentication": token,
        "ReceiverId" : receiverId
    },
    
})
.then(async (response) => {
    if (response.ok) {
        const messages = await response.json()
        onResult(messages);
    } else {
        const error = await response.json() ;
        onError(error);
    }
}, onError);
}


export function getRoomMessage(roomId,token,onResult, onError) {
    fetch("/api/getmessages", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authentication": token,
            "RoomId" : roomId
        },
        
    })
    .then(async (response) => {
        if (response.ok) {
            const messages = await response.json()
            onResult(messages);
        } else {
            const error = await response.json() ;
            onError(error);
        }
    }, onError);
    }
