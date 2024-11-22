export function registerUser(user ,onResult, onError) {
    fetch("/api/register",
        {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        .then(async (response) => {
            if (response.ok) {
                const session = await response.json();
                sessionStorage.setItem('token', session.token);
                sessionStorage.setItem('externalId', session.externalId);
                sessionStorage.setItem('username', session.username || "");
                onResult(session)
            } else {
                const error = await response.json();
                onError(error);
            }
        }, onError);
}
