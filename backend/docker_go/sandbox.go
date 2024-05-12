package main

import (
	"fmt"
	"os"
	"syscall"
)

const (
	memoryLimit = 64 * 1024 * 1024 // 64MB
	cpuTimeLimit = 3 // 3 seconds
	writeLimit = 512 // 512 bytes
)

func setLimits() {
	// Set memory limit
	if err := syscall.Setrlimit(syscall.RLIMIT_AS, &syscall.Rlimit{Cur: memoryLimit, Max: memoryLimit}); err != nil {
		fmt.Println("Failed to set memory limit:", err)
		os.Exit(1)
	}

	// Set CPU time limit
	if err := syscall.Setrlimit(syscall.RLIMIT_CPU, &syscall.Rlimit{Cur: cpuTimeLimit, Max: cpuTimeLimit}); err != nil {
		fmt.Println("Failed to set CPU time limit:", err)
		os.Exit(1)
	}

	// Set file size (write) limit
	if err := syscall.Setrlimit(syscall.RLIMIT_FSIZE, &syscall.Rlimit{Cur: writeLimit, Max: writeLimit}); err != nil {
		fmt.Println("Failed to set file size limit:", err)
		os.Exit(1)
	}
}

func main() {
	setLimits()

	code := os.Getenv("GO_CODE")
	if code == "" {
		fmt.Println("No code provided")
		os.Exit(1)
	}

	fmt.Println("Executing provided code:")
	fmt.Println(code)
	executeProvidedCode(code)
}

func executeProvidedCode(code string) {
	fmt.Println("Executing code...")
	fmt.Println(code)
}
