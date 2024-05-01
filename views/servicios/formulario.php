<div class="campo">
    <label for="nombre">Nombre</label>
    <input 
        type="text"
        id="nombre"
        pattern="[a-zA-Z ]{2,254}"
        placeholder="Nombre Servicio"
        name="nombre"
        value="<?php echo $servicio->nombre; ?>"
    />
</div>

<div class="campo">
    <label for="precio">Precio</label>
    <input 
        type="number"
        id="precio"
        placeholder="Precio Servicio"
        name="precio"
        value="<?php echo $servicio->precio; ?>"
    />
</div>

<div class="campo">
    <label for="tiempo">Tiempo</label>
    <input 
        type="number"
        id="tiempo"
        placeholder="Tiempo Servicio"
        name="tiempo"
        value="<?php echo $servicio->tiempo; ?>"
    />
</div>