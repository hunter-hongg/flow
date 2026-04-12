package file

import (
	"os"
)

func FileExists(filePath string) bool {
	s, err := os.Stat(filePath)
	if err != nil {
		return false
	}
	if s.IsDir() {
		return false
	}
	return true
}