const resizeImg = require('resize-img');
const catalyst = require('zcatalyst-sdk-node');
const fs = require('fs');

// async function changeFileSize(inputFileContent, outputFile) {
// 	console.log('in changeFileSize ');
// 	const newImage = await resizeImg(inputFileContent, { width: 200, height: 200 });
// 	fs.writeFileSync(outputFile, newImage);
// }
async function makeFileNew(inputFileContent, outputFile) {
	console.log('in changeFileSize ');
	// const newImage = await resizeImg(inputFileContent, { width: 200, height: 200 });
	fs.writeFileSync(outputFile, inputFileContent);
}
//Change the size of the file and send an email with the resized file and details of the content of the file
module.exports = async (event, context) => {
	try {
		var the_objectDetails = 'No Details Set';
		const catalystApp = catalyst.initialize(context);
		const fileName = event.data.file_name;
		console.log('fileName is ..... ' + fileName);
		const outputFile = 'resized-' + fileName;
		var fileExtension = fileName.split('.').pop();

		const filestore = catalystApp.filestore();
		const folder = filestore.folder(event.data.folder_details);
		const downloadedFile = await folder.downloadFile(event.data.id);
		//await changeFileSize(downloadedFile, outputFile);
				await makeFileNew(downloadedFile, outputFile);

		if (fileExtension === 'jpg' || fileExtension === 'png') {
			let objectDetails = await catalystApp.zia().detectObject(fs.createReadStream(outputFile));
			the_objectDetails = JSON.stringify(objectDetails);
		}
		console.log('The image is of --------------         ' + the_objectDetails);
		let config = {
			from_email: 'shankarr+1003@zohocorp.com',
			to_email: 'shankarr+1003@zohocorp.com',
			subject: 'Resized Image clear',
			content: "Resized Image is actually " + the_objectDetails
		};

		let mailObject = await catalystApp.email().sendMail(config);
		console.log("Mailing ----   " + mailObject);

		context.closeWithSuccess();
	}
	catch (err) {
		console.log('Error is ' + err.message);
		context.closeWithFailure();
	}
}
