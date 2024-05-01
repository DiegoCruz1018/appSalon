<?php 

namespace Model;

class Servicio extends ActiveRecord {
    // Base de datos
    protected static $tabla = 'servicios';
    protected static $columnasDB = ['id', 'nombre', 'precio', 'tiempo', 'creado'];

    public $id;
    public $nombre;
    public $precio;
    public $tiempo;
    public $creado;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->precio = $args['precio'] ?? '';
        $this->tiempo = $args['tiempo'] ?? '';
        $this->creado = date('Y/m/d');
    }

    public function validar() {
        if(!$this->nombre) {
            self::$alertas['error'][] = 'El Nombre del Servicio es Obligatorio';
        }
        if(!$this->precio) {
            self::$alertas['error'][] = 'El Precio del Servicio es Obligatorio';
        }
        if(!is_numeric($this->precio)) {
            self::$alertas['error'][] = 'El precio no es válido';
        }
        if(!$this->tiempo) {
            self::$alertas['error'][] = 'El Tiempo del Servicio es Obligatorio';
        }

        return self::$alertas;
    }
}