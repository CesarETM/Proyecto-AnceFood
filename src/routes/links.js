const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


// new order

router.get('/add', isLoggedIn, (req, res) => {
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
    res.redirect('/links');
});



router.get('/', isLoggedIn, async (req, res) =>{
    const orders = await pool.query('SELECT * FROM orders WHERE user_id = ?', [req.user.id]);
    res.render('links/list', {orders});
});



router.get('/delete/:id', isLoggedIn, async (req, res) =>{
    const { id } = req.params;
    await pool.query('DELETE FROM orders WHERE ID = ?', [id]);
    req.flash('success', 'Order removed successfully!');
    res.redirect('/links');
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
    res.redirect('/links');
});

module.exports = router;
