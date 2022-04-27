//clarifai-grpc api stuff
const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
const apiKey = process.env.CLARIFAI_API_KEY ? process.env.CLARIFAI_API_KEY : 'PUT YCLARIFAI API KEY HERE';
'1d511cc479844d0394fae530986ddbc7';
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${apiKey}`);


handleImage = (req, res, db) => {
    const { id, url } = req.body;

	db('users')	
	.where('id','=',id)
	.increment('entries', 1) //increment entries by 1
	.returning('entries')
	.then(users => {
		if (users.length) {
			//get regions from clarifai-grpc api
			let faceRegions = {};
			stub.PostModelOutputs(
				{
					// This is the model ID of a publicly available Face Detect model. You may use any other public or custom model ID.
					model_id: "a403429f2ddf4b49b307e318f00e528b", 
					inputs: [{data: {image: {url: url}}}]
				},
				metadata,
				(err, response) => {
					if (err) {
						console.log("Error: " + err);
						return;
					}

					if (response.status.code !== 10000) {
						console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
						return;
					}

					faceRegions = response.outputs[0].data.regions;
					res.json({
						entries: users[0].entries,
						regions: faceRegions
					});		
				}
			);	
		} else {
			res.status(404).json('Not found !');
		}				
	})
	.catch(err => {
		res.status(400).json('Database error !');
		console.log('DB', err);
    });
}

module.exports = {
    handleImage: handleImage
}