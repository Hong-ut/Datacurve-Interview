package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"time"
)

type CodeRequest struct {
	Code string `json:"code"`
}

type CodeResponse struct {
	Output     string `json:"output"`
	Error      string `json:"error"`
	StatusCode int    `json:"statusCode"`
}

func executeCode(w http.ResponseWriter, r *http.Request) {
	var req CodeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second) // Set timeout to 1 second
	defer cancel()

	// Write the user code to a temporary Go file
	codeFilePath := "sandbox.go"
	err := os.WriteFile(codeFilePath, []byte(req.Code), 0644)
	if err != nil {
		http.Error(w, "Failed to write code to file", http.StatusInternalServerError)
		return
	}
	defer os.Remove(codeFilePath) // Clean up after execution

	cmd := exec.CommandContext(ctx, "go", "run", codeFilePath)

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	errChan := make(chan error, 1)

	go func() {
		errChan <- cmd.Run()
	}()

	select {
	case <-ctx.Done():
		if ctx.Err() == context.DeadlineExceeded {
			if cmd.Process != nil {
				cmd.Process.Kill() // Ensure the process is killed if it exceeds the timeout
			}
			res := CodeResponse{
				Output:     "",
				Error:      "TIME LIMIT EXCEEDED!",
				StatusCode: http.StatusGatewayTimeout,
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(res)
			return
		}
	case err := <-errChan:
		output := stdout.String()
		errorMsg := stderr.String()
		if err != nil {
			errorMsg = err.Error() + ": " + errorMsg
		}

		res := CodeResponse{
			Output:     output,
			Error:      errorMsg,
			StatusCode: 200,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(res)
		return
	}
}

func main() {
	fmt.Println("Starting server on port 6000...")
	http.HandleFunc("/exec", executeCode)
	err := http.ListenAndServe(":6000", nil)
	if err != nil {
		fmt.Println("Failed to start server:", err)
		os.Exit(1)
	}
}
