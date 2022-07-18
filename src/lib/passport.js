const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) =>{
    const rows = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log(req.body);
    if (rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword){
            done (null, user, req.flash('success', 'Welcome ' + user.nombre));
        }else{
            done(null, false, req.flash('message', 'Incorrect Password'));
        }
    }else{
        return done(null, false, req.flash('message', 'The email does not exits'));
    }
}));



passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done)=>{
    const {nombre} = req.body;
    const {apellidos} = req.body;
    const newUser = {
        email,
        password,
        nombre,
        apellidos
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));



passport.serializeUser((user, done) =>{
    done (null, user.id);
});

passport.deserializeUser(async (id, done) =>{
    const rows = await pool.query('select * from users WHERE id = ?', [id]);
    done(null, rows[0]);
});
