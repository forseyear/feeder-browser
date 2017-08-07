module.exports = {
  "200": (file, response) => {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Mx-ReqToken,X-Requested-With",
      "Pragma": "no-cache",
      "Cache-Control" : "no-cache"
    };
    response.writeHead(200, headers);
    response.write(file, "binary");
    response.end();
  },
  "404": response => {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.write("404 Not Found\n");
    response.end();
  },
  "500": (err, response) => {
    response.writeHead(500, { "Content-Type": "text/plain" });
    response.write(`${err}\n`);
    response.end();
  },
};
