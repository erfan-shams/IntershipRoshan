package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time" // Import time for setting client timeout

	"strings" // Import for string manipulation (e.g., splitting URL path
)

// RequestPayload represents the structure of the incoming JSON request
// from the client to our Go server for transcription.
type RequestPayload struct {
	MediaURL string `json:"media_url"`
}

// TranscriptionRequest represents the structure of the JSON payload
// sent to the harf.roshan-ai.ir API for transcription.
type TranscriptionRequest struct {
	MediaURLs []string `json:"media_urls"`
}

// Segment represents a single transcribed segment from the API response.
type Segment struct {
	Start string `json:"start"`
	End   string `json:"end"`
	Text  string `json:"text"`
}

// Stats represents the statistics from the API response.
type Stats struct {
	Words      int `json:"words"`
	KnownWords int `json:"known_words"`
}

// TranscriptionResponseItem represents a single item in the array of the API response.
type TranscriptionResponseItem struct {
	MediaURL string    `json:"media_url"`
	Duration string    `json:"duration"`
	Segments []Segment `json:"segments"`
	Stats    Stats     `json:"stats"`
}

// TranscriptionResponse represents the full structure of the JSON response
// received from the harf.roshan-ai.ir API. It's an array of TranscriptionResponseItem.
type TranscriptionResponse []TranscriptionResponseItem

// ListRequestsAPIResponse represents the expected structure of the response
// from the "list requests" API endpoint.
type ListRequestsAPIResponse struct {
	Count    int         `json:"count"`
	Next     *string     `json:"next"` // Use pointer for nullable fields
	Previous *string     `json:"previous"`
	Results  interface{} `json:"results"` // Use interface{} to capture the 'results' as is
}

// enableCORS is a middleware to add CORS headers to responses.
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}

// transcribeHandler handles incoming requests, proxies them to the transcription API,
// and sends the response back to the client.
func transcribeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	var reqPayload RequestPayload
	err := json.NewDecoder(r.Body).Decode(&reqPayload)
	if err != nil {
		log.Printf("Error decoding incoming request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Printf("Received request to transcribe: %s", reqPayload.MediaURL)

	transcriptionReq := TranscriptionRequest{
		MediaURLs: []string{reqPayload.MediaURL},
	}

	jsonPayload, err := json.Marshal(transcriptionReq)
	if err != nil {
		log.Printf("Error marshalling transcription request payload: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	externalAPIURL := "https://harf.roshan-ai.ir/api/transcribe_files/"
	authToken := "Token a85d08400c622b50b18b61e239b9903645297196" // IMPORTANT: Manage securely in production

	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	req, err := http.NewRequest(http.MethodPost, externalAPIURL, bytes.NewBuffer(jsonPayload))
	if err != nil {
		log.Printf("Error creating request to external API: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", authToken)

	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error sending request to external API: %v", err)
		http.Error(w, "Failed to connect to transcription service", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBody, _ := io.ReadAll(resp.Body)
		log.Printf("External API returned non-OK status: %d, Body: %s", resp.StatusCode, respBody)
		http.Error(w, fmt.Sprintf("Transcription service error: %s", resp.Status), resp.StatusCode)
		return
	}

	var transcriptionResp TranscriptionResponse
	err = json.NewDecoder(resp.Body).Decode(&transcriptionResp)
	if err != nil {
		log.Printf("Error decoding response from external API: %v", err)
		http.Error(w, "Failed to parse transcription service response", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(transcriptionResp)
	if err != nil {
		log.Printf("Error encoding response for client: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	log.Printf("Successfully transcribed and sent response for: %s", reqPayload.MediaURL)
}

// listRequestsHandler handles GET requests to list all requests from the external API.
// This function will now be called by requestsRouter.
func listRequestsHandler(w http.ResponseWriter, r *http.Request) {
	// No need to check r.Method here, as requestsRouter already ensures it's GET.
	// Also, no need to check for path segments, as this is for the base /api/requests/

	w.Header().Set("Content-Type", "application/json")

	externalAPIURL := "https://harf.roshan-ai.ir/api/requests/"
	authToken := "Token a85d08400c622b50b18b61e239b9903645297196" // IMPORTANT: Manage securely in production

	client := &http.Client{
		Timeout: 10 * time.Second, // Shorter timeout for listing requests
	}

	req, err := http.NewRequest(http.MethodGet, externalAPIURL, nil)
	if err != nil {
		log.Printf("Error creating request to external API: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	req.Header.Set("Authorization", authToken)

	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error sending request to external API: %v", err)
		http.Error(w, "Failed to connect to list requests service", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBody, _ := io.ReadAll(resp.Body)
		log.Printf("External API returned non-OK status: %d, Body: %s", resp.StatusCode, respBody)
		http.Error(w, fmt.Sprintf("List requests service error: %s", resp.Status), resp.StatusCode)
		return
	}

	var apiResponse ListRequestsAPIResponse
	err = json.NewDecoder(resp.Body).Decode(&apiResponse)
	if err != nil {
		log.Printf("Error decoding response from external API: %v", err)
		http.Error(w, "Failed to parse list requests service response", http.StatusInternalServerError)
		return
	}

	// Return only the 'results' field as requested
	err = json.NewEncoder(w).Encode(apiResponse.Results)
	if err != nil {
		log.Printf("Error encoding response for client: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	log.Println("Successfully listed requests and sent results.")
}

// deleteRequestHandler handles DELETE requests to remove a specific request from the external API.
// This function will now be called by requestsRouter.
func deleteRequestHandler(w http.ResponseWriter, r *http.Request) {
	// No need to check r.Method here, as requestsRouter already ensures it's DELETE.

	// Extract the request ID from the URL path.
	// r.URL.Path will be something like "/api/requests/123/"
	pathParts := strings.Split(r.URL.Path, "/")
	// The ID should be the second to last element if there's a trailing slash,
	// or the last element if no trailing slash.
	// Example: ["", "api", "requests", "123", ""] -> pathParts[3] is "123"
	// Example: ["", "api", "requests", "123"] -> pathParts[3] is "123"

	var requestID string
	// Check if the last part is empty (trailing slash)
	if len(pathParts) > 0 && pathParts[len(pathParts)-1] == "" {
		// If there's a trailing slash, the ID is the second to last element
		if len(pathParts) >= 2 { // Ensure there's at least /ID/
			requestID = pathParts[len(pathParts)-2]
		}
	} else {
		// If no trailing slash, the ID is the last element
		if len(pathParts) >= 1 {
			requestID = pathParts[len(pathParts)-1]
		}
	}

	if requestID == "" || requestID == "requests" { // "requests" would be the case for /api/requests/ without an ID
		http.Error(w, "Invalid request ID in URL", http.StatusBadRequest)
		return
	}

	log.Printf("Attempting to delete request with ID: %s", requestID)

	externalAPIURL := fmt.Sprintf("https://harf.roshan-ai.ir/api/requests/%s/", requestID)
	authToken := "Token a85d08400c622b50b18b61e239b9903645297196" // IMPORTANT: Manage securely in production

	client := &http.Client{
		Timeout: 10 * time.Second, // Shorter timeout for delete requests
	}

	req, err := http.NewRequest(http.MethodDelete, externalAPIURL, nil)
	if err != nil {
		log.Printf("Error creating request to external API: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	req.Header.Set("Authorization", authToken)

	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error sending request to external API: %v", err)
		http.Error(w, "Failed to connect to delete service", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNoContent { // 204 No Content is typical for successful DELETE
		log.Printf("Successfully deleted request with ID: %s", requestID)
		w.WriteHeader(http.StatusNoContent)
		return
	} else if resp.StatusCode == http.StatusNotFound { // 404 Not Found if ID doesn't exist
		log.Printf("Request with ID %s not found.", requestID)
		http.Error(w, "Request not found", http.StatusNotFound)
		return
	} else {
		respBody, _ := io.ReadAll(resp.Body)
		log.Printf("External API returned non-successful status for delete: %d, Body: %s", resp.StatusCode, respBody)
		http.Error(w, fmt.Sprintf("Delete service error: %s", resp.Status), http.StatusInternalServerError)
		return
	}
}

// requestsRouter acts as a multiplexer for /api/requests/ and /api/requests/{id}/ paths.
func requestsRouter(w http.ResponseWriter, r *http.Request) {
	// Trim the base path "/api/requests/" to get the remaining path segments.
	// Example: "/api/requests/123/" -> "123/"
	// Example: "/api/requests/" -> ""
	path := strings.TrimPrefix(r.URL.Path, "/api/requests/")
	path = strings.TrimSuffix(path, "/") // Remove trailing slash if present

	// If path is empty, it means the request is for /api/requests/
	if path == "" {
		if r.Method == http.MethodGet {
			listRequestsHandler(w, r)
		} else {
			http.Error(w, "Method Not Allowed for /api/requests/", http.StatusMethodNotAllowed)
		}
	} else { // Path contains an ID, e.g., "123"
		if r.Method == http.MethodDelete {
			// Temporarily modify r.URL.Path to include the ID for deleteRequestHandler
			// This is a bit of a hack but allows deleteRequestHandler to reuse its existing logic.
			// A cleaner approach would be to pass the extracted ID directly.
			originalPath := r.URL.Path
			r.URL.Path = fmt.Sprintf("/api/requests/%s/", path) // Reconstruct path for delete handler's parsing
			deleteRequestHandler(w, r)
			r.URL.Path = originalPath // Restore original path
		} else {
			http.Error(w, "Method Not Allowed for /api/requests/{id}/", http.StatusMethodNotAllowed)
		}
	}
}

func main() {
	// Register the transcription handler
	http.HandleFunc("/transcribe", enableCORS(transcribeHandler))

	// Register a single router for all /api/requests/ related paths
	http.HandleFunc("/api/requests/", enableCORS(requestsRouter))

	port := ":8080"
	log.Printf("GoLang proxy server starting on port %s", port)

	err := http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
