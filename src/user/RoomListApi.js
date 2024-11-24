export function listRooms(onResult, onError) {
    const token = sessionStorage.getItem('token');
    fetch("/api/rooms", {
        method: "GET", 
        headers: {
            "Content-Type": "application/json", 
            "Authentication": `Bearer ${token}`,

        },
    })
    .then(async (response) => {
        if (response.ok) {
            const rooms = await response.json(); 
            onResult(rooms); 
        } else {
            const error = await response.json();
            sessionStorage.clear();
            onError(error); 
        }
    })
    .catch(onError); 
}