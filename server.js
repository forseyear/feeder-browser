const config = require("./config");
const schedule = require("./schedule");
const response = require("./response");

const EventEmitter = require("events").EventEmitter;
const eventEmitter = new EventEmitter();

const https = require("https");
const url = require("url");
const path = require("path");
const fs = require("fs");

module.exports = class Server {
  constructor(port) {
    this.options = {
      pfx: fs.readFileSync(config.server.pfx.path),
      passphrase: config.server.pfx.pass,
    };
    this.port = port;
    this.create(this.port);
  };

  create(port) {
    https.createServer(this.options, (req, res) => {
      this.request(req, res);
    }).listen(parseInt(this.port, 10), () => {
      console.log(`Server running at https://localhost:${this.port}`)
    });
  };

  request(req, res) {
    const uri = url.parse(req.url).pathname;
    const fileName = path.join(process.cwd(), uri);

    if (uri === "/schedule.json") {
      this.checkSchdule(fileName);
      eventEmitter.once("updated", () => {
        this.response(uri, fileName, res)
      });
      return;
    }

    this.response(uri, fileName, res);
  };

  response(uri, fileName, res) {
    fs.exists(fileName, exists => {
      console.log(uri, exists);

      if (!exists) {
        response["404"](res);
        return;
      }

      if (fs.statSync(fileName).isDirectory()) {
        fileName += "/index.html";
      }

      fs.readFile(fileName, "binary", (err, file) => {
        if (err) {
          response["500"](err, res);
          return;
        }
        response["200"](file, res);   
      });
    });
  };

  checkSchdule(fileName) {
    fs.exists(fileName, exists => {
      if (!exists) {
        schedule.update();
      } else {
        const json = JSON.parse(fs.readFileSync(fileName, "utf-8"));
        const timeSpan = parseInt(json.source.time.local_time) - Math.floor(+new Date(json.source.time.now) / 1000);
        if ((parseInt(json.result.regular[0].end_t) + timeSpan) > Math.floor(+new Date() / 1000)) {
          eventEmitter.emit("updated");
          return;
        } else {
          schedule.update();
        }
      }
      eventEmitter.emit("updated");
    });
  };
};

