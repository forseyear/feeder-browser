const request = require("request");
const fs = require("fs");
const config = require("./config");

module.exports = {
  update: () => {
    console.log("update_schedule");
    request.get({
      url: config.request.splapi,
      json: true,
      headers: {
        "User-Agent": config.request.userAgent,
      },
    }, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        let json = body;
        json.source.time.local_time = Math.floor(+new Date() / 1000);
        fs.writeFile("schedule.json", JSON.stringify(json), error => {
          if (error) console.log(`write_error: ${error}`);
        });
      } else {
        console.log(`request_error: ${err}`);
        console.log(`status_code: ${res.statusCode}`);
      }
    });
  },
};
