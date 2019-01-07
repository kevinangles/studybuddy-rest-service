const auth = require('./../auth');

const bcrypt = require('bcrypt');

module.exports = (app, db) => {

  // POST register a new user
  app.post('/register/', (req, res, next) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;
    const references = req.body.reference;

    db.users.findOne({
      where: { email: email }
    })
      .then(existingUser => {
        if (existingUser) {
          return res.status(409).send({ message: 'The email ' + existingUser.email + ' is taken' });
        } else {
          db.users.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password
          })
            .then(newUser => {
              for (reference of references) {
                newUser.addCourse(reference);
              }
              auth.generateToken(res, newUser);
              return null;
            })
            .catch(next);
          return null;
        }
      })
      .catch(next)
  });

  // POST log a user in
  app.post('/login/', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    db.users.scope('withPassword').findOne({
      where: { email: email },
      attributes: { exclude: ['id'] }
    })
      .then(foundUser => {
        bcrypt.compare(password, foundUser.password).then(match => {
          if (match) { auth.generateToken(res, foundUser); }
        });
      })
      .catch(next);
  });
};