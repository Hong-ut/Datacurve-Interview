FROM golang:1.16

WORKDIR /app

COPY . /app

EXPOSE 6000

CMD ["go", "run", "main.go"]

# docker build -t go-code-executor . 
# docker run -p 6000:6000 go-code-executor
