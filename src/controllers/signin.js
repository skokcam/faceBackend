
const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;

    //check if email/password is empty
    if (!email || !password) {
        return res.status(400).json('Incorrect form submission !');
    }

	db
	.select('email','hash')
	.from('login')
	.where('email','=',email)
	.then(login => {
		if (bcrypt.compareSync(password, login[0].hash))
		{
			db
			.select('*')
			.from('users')
			.where('email','=',login[0].email)
			.then(userdata => {
				res.json(userdata[0]);
				console.log('login:', req.session.userID);
			})
		} else {
			res.status(400).json('Error: logging in');
		}
	})
	.catch(err => {
		console.log('DB',err);
	});	
}

const handleSignout = (req, res) => {
	req.session.destroy();
	res.json('LogOff');
	console.log('logout:', req.session.userID);
}

module.exports = {
    handleSignin: handleSignin,
    handleSignout: handleSignout
};