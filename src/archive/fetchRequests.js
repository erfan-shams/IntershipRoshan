



const GO_SERVER_BASE_URL = "http://localhost:8080"; // Make sure this matches your Go server's port

/**
 * Fetches and lists all requests from the GoLang server's /api/requests/ endpoint.
 * This function expects the Go server to return the 'results' array directly.
 * @returns {Promise<Array|null>} A promise that resolves to an array of request objects
 * or null if an error occurs.
 */
export async function listRequests() {
    const url = `${GO_SERVER_BASE_URL}/api/requests/`;
    console.log(`Attempting to list requests from: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // No Authorization header needed here, as the Go server adds it.
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
            // You could display a message box here instead of console.error
            return null;
        }

        const data = await response.json();
        for(let key in data){
            
            let text = ''
            for (let segment in data[key]['segments']){
                text += data[key]['segments'][segment]['text']
            }
            data[key]['text'] = text
        }
        console.log("Successfully listed requests:", data);
        return data; // This should be the 'results' array from the Go server
    } catch (error) {
        console.error("Error listing requests:", error);
        // You could display a message box here instead of console.error
        return null;
    }
}

/**
 * Deletes a specific request using its ID via the GoLang server's /api/requests/{id}/ endpoint.
 * @param {string} requestId The ID of the request to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful,
 * false otherwise.
 */
export async function deleteRequest(requestId) {
    if (!requestId) {
        console.error("Request ID is required for deletion.");
        // You could display a message box here instead of console.error
        return false;
    }

    const url = `${GO_SERVER_BASE_URL}/api/requests/${requestId}/`;
    console.log(`Attempting to delete request with ID ${requestId} from: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                // No Authorization header needed here, as the Go server adds it.
            },
        });

        if (response.status === 204) { // 204 No Content is expected for successful DELETE
            console.log(`Request with ID ${requestId} deleted successfully.`);
            return true;
        } else if (response.status === 404) {
            console.warn(`Request with ID ${requestId} not found.`);
            // You could display a message box here instead of console.warn
            return false;
        } else {
            const errorText = await response.text();
            console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
            // You could display a message box here instead of console.error
            return false;
        }
    } catch (error) {
        console.error(`Error deleting request with ID ${requestId}:`, error);
        // You could display a message box here instead of console.error
        return false;
    }
}
