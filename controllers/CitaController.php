<?php

namespace Controllers;

use MVC\Router;
use Model\Empleado;

class CitaController {
    public static function index( Router $router ) {

        session_start();

        isAuth();

        //$empleados = Empleado::all();

        $router->render('cita/index', [
            'nombre' => $_SESSION['nombre'],
            'id' => $_SESSION['id']
        ]);
    }
}