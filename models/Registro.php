<?php

namespace Model;

class Registro extends ActiveRecord {
    protected static $tabla = 'registros';
    protected static $columnasDB = ['id', 'pago_id', 'token', 'usuario_id'];

    public $id;
    public $pago_id;
    public $token;
    public $usuario_id;

    public function __construct($args = [])
    {
       $this->id = $args['id'] ?? null;
       $this->pago_id = $args['pago_id'] ?? ''; 
       $this->token = $args['token'] ?? ''; 
       $this->usuario_id = $args['usuario_id'] ?? ''; 
    }
}