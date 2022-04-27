
const handleProfileGet = (req, res, db) => {
    const { id } = req.params;

	db('users')
	.select('*')
	.where({id}) //this is equal to {id : id} in ES6
	.then(user => {
		if (user.length) { //if user.length > 0
			res.json(user[0]);			
		} else {
			res.status(404).json('No such user !');
		}		
	})
	.catch(err => {
		console.log('DB',err);
		res.status(400).json('Database Error !');
	});
}

const handleProfiles = (req, res, db) => {
    db.select('*').from('users')
	.then(data => {
		res.json(data);
	});
}

module.exports = {
    handleProfileGet: handleProfileGet,
    handleProfiles: handleProfiles
}