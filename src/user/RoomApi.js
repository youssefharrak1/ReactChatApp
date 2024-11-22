export function postRoomMessage(message,token,onResult, onError) {
    
    fetch("/api/postmessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authentication": token, 
        },
        body: JSON.stringify(message), 
    })
    .then(async (response) => {
        if (response.ok) {
            onResult();
        } else {
            const error = await response.json() ;
            onError(error);
        }
    }, onError);




    
}