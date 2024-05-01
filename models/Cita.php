<?php

namespace Model;

class Cita extends ActiveRecord {
    // Base de datos
    protected static $tabla = 'citas';
    protected static $columnasDB = ['id', 'fecha', 'hora', 'horaFin', 'usuarioId', 'empleadoId'];

    public $id;
    public $fecha;
    public $hora;
    public $horaFin;
    public $usuarioId;
    public $empleadoId;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->fecha = $args['fecha'] ?? '';
        $this->hora = $args['hora'] ?? '';
        $this->horaFin = $args['horaFin'] ?? '';
        $this->usuarioId = $args['usuarioId'] ?? '';
        $this->empleadoId = $args['empleadoId'] ?? '';
    }
}