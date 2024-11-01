import React, { useState} from "react";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";

//Componente para el formulario de proyectos
function FormularioProyectos({ addProyecto }) {
    const [form, setForm] = useState({ nombre: '', descripcion: '' });
    const [validator] = useState(new SimpleReactValidator());

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validator.allValid()) {
            try {
                // Solicitud a una API simulada (jsonplaceholder) antes de guardar el proyecto
                const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
                console.log("Datos de la API", response.data);
                
                const additionalData = response.data;
                const proyectoConDatos = {...form,additionalInfo: additionalData.title};  // Agrega información adicional, ejemplo 'title'
                
                addProyecto(proyectoConDatos);
                setForm({ nombre: '', descripcion: '' });
                validator.hideMessages();
            } catch (error) {
                console.error("Error al agregar proyecto:", error);
            }
        } else {
            validator.showMessages();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nombre Proyecto:</label>
                <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                />
                {/*Valida que el nombre sea obligatorio */}
                {validator.message('nombre', form.nombre, 'required|alpha')}
            </div>
            <div>
                <label>Descripción:</label>
                <input
                type="text"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                />
                {/*Valida que la descripción sea obligatoria y tenga un mínimo de 10 caracteres */}
                {validator.message('descripcion', form.descripcion, 'required|min:10')} 
            </div>
            <button type="submit">Agregar Proyecto</button>
        </form>
    );
}

//Componente para listar los proyectos agregados
function ListaProyectos({ proyectos }) {
    return (
        <React.Fragment>
            {proyectos.length > 0 ? (
                <ul>
                    {proyectos.map((proyecto) => (
                        <li key={proyecto.nombre}>
                            {proyecto.nombre} - {proyecto.descripcion}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>La lista de Proyectos está vacía.</p>
            )}
        </React.Fragment>
    )
}

function ProyectManagementApp() {
    const [proyectos, setProyectos] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const addProyecto = (proyecto) => {
        setProyectos([...proyectos, proyecto])
    };

    return (
        <div>
            <h1>Gestión de Proyectos</h1>
            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Ocultar formulario' : 'Agregar Proyecto'}
            </button>

            {showForm && <FormularioProyectos addProyecto={addProyecto} />}
            <ListaProyectos proyectos={proyectos} />
        </div>
    );
}

export default ProyectManagementApp;





