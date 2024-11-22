export function listUsers(onResult, onError) {
    const token = sessionStorage.getItem('token');
    fetch("/api/users", {
        method: "GET", // We just need to fetch data, so it's a GET request.
        headers: {
            "Content-Type": "application/json", // This is not necessary for GET but can be left.
            "Authentication": `Bearer ${token}`,

        },
    })
    .then(async (response) => {
        if (response.ok) {
            const users = await response.json(); // Assuming the response contains a list of users.
            onResult(users); // Pass the list of users to the callback.
        } else {
            const error = await response.json();
            onError(error); // Pass the error to the callback if the request fails.
        }
    })
    .catch(onError); // In case of a network or other error.
}