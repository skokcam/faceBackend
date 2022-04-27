
const handleRegister = (req, res, db, bcrypt) => {
    const { email, password, name } = req.body;
	const hash = bcrypt.hashSync(password);

    //check if email/password/name is empty
    if (!email || !password || !name) {
        return res.status(400).json('Incorrect form submission !');
    }

    console.log('Register new user:', req.body);
	db.transaction(trx => {
		trx
		.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning(['id','email'])
		.then(login => {
			trx('users')
			.returning('*')
			.insert({
				id : login[0].id,
				email : login[0].email,
				name : name,
				joined : new Date()
			})
			.then(userdata => {
				res.json(userdata[0]);	//knex returns an array with 1 item
			});
		})
		.then(trx.commit)
		.catch(trx.rollback);
	})
	.catch(err => {
		res.status(400).json("Unable to register !");
		console.log('DB',err);
	});		   
}

module.exports = {
    handleRegister: handleRegister
};