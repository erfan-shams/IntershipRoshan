export default async function sendToTranscriptionProxy(mediaUrl) {
    // The URL of your local GoLang proxy server's transcription endpoint
    const proxyUrl = "http://localhost:8080/transcribe";

    // The payload to be sent to the GoLang proxy server
    const payload = {
        media_url: mediaUrl
    };

    try {
        // Perform the fetch request to the GoLang proxy
        const response = await fetch(proxyUrl, {
            method: "POST", // The Go server expects a POST request
            headers: {
                "Content-Type": "application/json" // Specify that the body is JSON
            },
            body: JSON.stringify(payload) // Convert the JavaScript object to a JSON string
        });

        // Check if the response from the proxy server is OK (status code 2xx)
        if (!response.ok) {
            // If the proxy server returned an error, read its response body
            const errorText = await response.text();
            let errorMessage = `HTTP error from proxy! Status: ${response.status}`;
            try {
                // Try to parse as JSON if it's a JSON error response
                const errorJson = JSON.parse(errorText);
                errorMessage += `, Details: ${JSON.stringify(errorJson)}`;
            } catch (e) {
                // Otherwise, just include the raw text
                errorMessage += `, Response text: ${errorText}`;
            }
            throw new Error(errorMessage);
        }

        // Parse the JSON response received from the proxy server
        const data = await response.json();
        return data['0']; // Return the transcription data
    } catch (error) {
        // Catch any network errors or errors thrown during the process
        console.error("Error sending request to GoLang proxy:", error);
        // Re-throw the error to allow the caller to handle it
        throw error;
    }
}

export function produceText(data){
     const segments = data['segments']
     let text = ""
     
     for(const segment in segments){
            
            text += segments[segment]['text']
     }
     return text
}
export function prduceSegments(data){
    const segments = data['segments']
    let segs = []
    let i = 0
    for(const segment in segments){
        segs.push({'top':i*40+"%",'text':segments[segment]['text'],'start':segments[segment]['start'],'end':segments[segment]['end']})
        i+=1
        
    }
    return segs
}