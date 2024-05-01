<?php

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;
use Model\Empleado;

class APIController {
    public static function index() {
        $servicios = Servicio::all();
        echo json_encode($servicios);
        return;
    }

    public static function empleados(){

        if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {
            header('Content-Type: application/json');
            $datosQuery = new Cita($_POST);
            
            $query = "SELECT e.id, e.nombre";
            $query .= " FROM empleados e";
            $query .= " LEFT JOIN citas c ON e.id = c.empleadoId";
            $query .= " AND c.fecha='" . $datosQuery->fecha . "' AND ((c.hora BETWEEN '" . $datosQuery->hora . "' AND '" . $datosQuery->horaFin . "')";
            $query .= " OR (c.horaFin BETWEEN '" . $datosQuery->hora . "' AND '" . $datosQuery->horaFin . "')) ";
            $query .= " WHERE c.id IS NULL";

            $objBarberos = Empleado::traer($query);
            echo json_encode($objBarberos);
            return;
        }
        
    }

    public static function guardar() {
        
        // Almacena la Cita y devuelve el ID
        $cita = new Cita($_POST);
        $resultado = $cita->guardar();

        $id = $resultado['id'];

        // Almacena la Cita y el Servicio

        // Almacena los Servicios con el ID de la Cita
        $idServicios = explode(",", $_POST['servicios']);
        foreach($idServicios as $idServicio) {
            $args = [
                'citaId' => $id,
                'servicioId' => $idServicio
            ];
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        }

        echo json_encode(['resultado' => $resultado]);
    }

    public static function eliminar() {
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $cita = Cita::find($id);
            $cita->eliminar();
            header('Location:' . $_SERVER['HTTP_REFERER']);
        }
    }
}