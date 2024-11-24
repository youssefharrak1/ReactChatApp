export function postMessage(message,token,onResult, onError) {
    
    fetch("/api/postmessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authentication": token, 
        },
        body: JSON.stringify(message), // Convert message to JSON string
    })
    .then(async (response) => {
        if (response.ok) {
            onResult();
        } else {
            const error = await response.json() ;
            sessionStorage.clear();
            onError(error);
        }
    })
    .catch(onError);



}