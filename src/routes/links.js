const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const helpers = require('../lib/helpers');


// new order

router.get('/adda', isLoggedIn, (req, res) => {
    res.render('links/add');
});


router.post('/add', isLoggedIn, async (req, res) => {
    const {plate, hora_envio, dia, direccion } = req.body;
    const neworder = {
        plate,
        hora_envio,
        dia,
        direccion,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO orders set ?', [neworder]),
    req.flash('success', 'Order saved successfully');
    res.redirect('/links/add');
});



router.get('/add', isLoggedIn, async (req, res) =>{
    const orders = await pool.query('SELECT * FROM orders WHERE user_id = ?', [req.user.id]);
    res.render('links/add', {orders});
});



router.get("/edit-register", isLoggedIn, async (req, res) =>{
    const usuarios = await pool.query('SELECT * FROM users WHERE id = ? ', [req.user.id]);
    console.log(usuarios);
    res.render('links/edit-register', {usuarios});
});




router.get('/delete/:id', isLoggedIn, async (req, res) =>{
    const { id } = req.params;
    await pool.query('DELETE FROM orders WHERE ID = ?', [id]);
    req.flash('success', 'Order removed successfully!');
    res.redirect('/links/add');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const {id}  = req.params;
    const orders = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    res.render('links/edit', {orders: orders[0]});
});


router.post('/edit/:id', isLoggedIn, async (req, res) =>{
    const {id}  = req.params;
    const {plate, hora_envio, dia, direccion } = req.body;
    const neworder = {
        plate,
        hora_envio,
        dia,
        direccion
    };
    await pool.query('UPDATE orders set ? WHERE ID = ?', [neworder, id]);
    req.flash('success', 'Order update successfully!');
    res.redirect('/links/add');
});

/* CAMBIOS Y AUMENTOS DE CODIGO DE CONFIGURACION DE REGISTRO */

router.get('/edit-register/:id', isLoggedIn, async (req, res) => {
    const {id}  = req.params;
    const users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    console.log(users);
    res.render('links/edit-register', {users: users[0]});
});


router.post('/edit-register/:id', isLoggedIn, async (req, res) =>{
    const {id}  = req.params;
    const {nombre, apellidos, email, password } = req.body;
    const changeregister = {
        nombre,
        apellidos,
        email,
        password
    };
    changeregister.password = await helpers.encryptPassword(password);
    await pool.query('UPDATE users set ? WHERE ID = ?', [changeregister, id]);
    req.flash('success', 'Actualizado satisfactoriamente!');
    res.redirect('/links/edit-register');
});

module.exports = router;



/* COMENTARIOS DE USUARIOS  */

router.get('/addComment', isLoggedIn, (req, res) => {
    res.render('Comments/addComment');
});


router.post('/addComment', isLoggedIn, async (req, res) => {
    const {comentario} = req.body;
    const newcomment = {
        comentario,
        user_id1: req.user.id
    };
    await pool.query('INSERT INTO recommends set ?', [newcomment]),
    req.flash('success', 'Comentario agregado exitosamente');
    res.redirect('/links/Comments');
});



router.get('/Comments', isLoggedIn, async (req, res) =>{
    const recommends = await pool.query('SELECT * FROM recommends');
    res.render('Comments/Comments', {recommends});
});




router.get('/deletecomment/:id', isLoggedIn, async (req, res) =>{
    const { id } = req.params;
    await pool.query('DELETE FROM recommends WHERE ID = ?', [id]);
    req.flash('success', 'Comentario borrado exitosamente!');
    res.redirect('/Comments/Comments');
});

router.get('/editcomment/:id', isLoggedIn, async (req, res) => {
    const {id}  = req.params;
    const comment = await pool.query('SELECT * FROM recommends WHERE id = ?', [id]);
    res.render('Comments/editcomment', {comment: comment[0]});
});


router.post('/editcomment/:id', isLoggedIn, async (req, res) =>{
    const {id}  = req.params;
    const {comentario} = req.body;
    const newcomment = {
        comentario
    };
    await pool.query('UPDATE recommends set ? WHERE ID = ?', [newcomment, id]);
    req.flash('success', 'Comentario actualizado');
    res.redirect('/Comments/Comments');
});