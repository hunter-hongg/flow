package main

// 导入 gin 框架
import "github.com/gin-gonic/gin"

func main() {
	r := gin.Default()

	r.GET("/api/status", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "OK",
		})
	})

	r.Run(":8080")
}