CREATE DATABASE BD_ANCEFOOD;

USE BD_ANCEFOOD;


--users table
CREATE TABLE users(
    id INT (11) NOT NULL primary key auto_increment,
    nombre VARCHAR(16) NOT NULL,
    apellidos varchar(16) not null,
    email varchar(40) not null,
    password VARCHAR(8) NOT NULL
);

describe users;

--

create TABLE orders(
    id int (11) not null primary key auto_increment,
    plate varchar (30) not null, 
    hora_envio varchar(10) not null,
    dia varchar(30) not null,
    direccion varchar(40) not null, 
    user_id int(11),
    created_at timestamp not null default current_timestamp,
    constraint fk_user foreign key (user_id) references users(id)
);