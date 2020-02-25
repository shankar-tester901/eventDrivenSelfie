const express = require('express');
const fs = require('fs');
const catalyst = require("zcatalyst-sdk-node");
const app = express();
var count = 0;
app.post('/selfieUpload', (req, res) => {

	const catalystApp = catalyst.initialize(req);
	const filestore = catalystApp.filestore();

	var body = '';
	req.on('data', function (data) {
		body += data;
	});


	req.on('end', function () {
		count++;
		console.log(' -----------------------------------------            count is  ' + count);

		post = JSON.parse(body);
		var data_parsed = post.replace(/^data:image\/\w+;base64,/, "");
		var buf = Buffer.from(data_parsed, 'base64');

		var genRandomNum = Math.floor(Date.now() / 1000);
		var image_tempName = genRandomNum + '.png';


		var fileDir = __dirname + '/' + image_tempName;
		//	console.log('fileDir is  ' + fileDir);

		fs.writeFile(fileDir, buf, function (err) {
			if (err) {
				console.log("Error in writing file " + err);
				res.send('Unable to upload original file');
			}
			filestore
				.folder('343000000078372')
				.uploadFile({
					code: fs.createReadStream(__dirname + "/" + image_tempName),
					name: image_tempName
				}).catch(err1 => {
					console.log('Error here ' + err1);
					res.send('Sadly,<link href="https://fonts.googleapis.com/css?family=Odibee+Sans:regular" rel="stylesheet" /> unable to upload now');
				});
			console.log('File Uploaded Successfully');
		})
	});
})

module.exports = app;
