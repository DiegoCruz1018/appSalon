<?php

namespace Controllers;

use Model\Registro;
use MVC\Router;

class RegistroController {
    public static function crear(Router $router){

        $router->render('registro/crear', [
            'titulo' => 'Finalizar Registro'
        ]);
    }

    public static function pago(Router $router){
        if($_SERVER['REQUEST_METHOD'] === 'POST'){

            $token = substr(md5(uniqid(rand(), true)), 0, 8);

            //Crear pago
            $datos = array(
                'pago_id' => '',
                'token' => $token,
                'usuario_id' => $_SESSION['id']
            );

            $registro = new Registro($datos);

            $registro = new Registro($datos);
            $resultado = $registro->guardar();
        }
    }
}
