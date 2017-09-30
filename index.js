var login = require("facebook-chat-api");
var fs = require('fs');
var db = JSON.parse(fs.readFileSync('database.json', 'utf8'));

login({email: "", password: ""}, (err, api) => {
  if(err) return console.error(err);

  // reply when i talk to myself
  api.setOptions({
    selfListen: true
  });

  api.listen((err, message) => {

    // send message with media
    function video(videoname, link) {
      console.log("Replying with " + videoname + " and " + link);
      api.sendMessage({
        url: link
        }, message.threadID
      );
    }

    // loop through songs array
    for (song in db.songs) {
      // loop through each song's search queries
      for (query in db.songs[song].queries) {
        // create regex expression
        var regexp = new RegExp("\\b" + db.songs[song].queries[query] + "\\b", 'i');
        // test if regex matches
        if (regexp.test(message.body)) {
          // call video file with random media file
          video(db.songs[song].title, db.songs[song].media[Math.floor(Math.random()*db.songs[song].media.length)])
        }
      }
    }

  });
});
