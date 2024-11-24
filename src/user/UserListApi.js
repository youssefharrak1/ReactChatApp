export function listUsers(onResult, onError) {
    const token = sessionStorage.getItem('token');
    fetch("/api/users", {
        method: "GET", 
        headers: {
            "Content-Type": "application/json", 
            "Authentication": `Bearer ${token}`,

        },
    })
    .then(async (response) => {
        if (response.ok) {
            const users = await response.json(); 
            onResult(users);
        } else {
            const error = await response.json();
            onError(error); 
        }
    })
    .catch(onError); 
}