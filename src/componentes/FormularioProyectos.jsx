import React, { useState, useEffect } from "react";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import { db, deleteDoc, doc } from '../firebase';
import { collection, addDoc, onSnapshot } from "firebase/firestore";


// Componente para el formulario de proyectos
function FormularioProyectos() {
    const [form, setForm] = useState({ nombre: '', descripcion: '' });
    const [validator] = useState(new SimpleReactValidator());
    const [error, setError] = useState(null);
    
    //Estado para controlar el envío
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validator.allValid()) {
            setIsSubmitting(true);
            try {
                const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
                const additionalData = response.data;
                const proyectoConDatos = { ...form, additionalInfo: additionalData.title };

                await addDoc(collection(db, "proyectos"), proyectoConDatos);

                // Limpiar el formulario
                setForm({ nombre: '', descripcion: '' });
                validator.hideMessages();
                setError(null);
                console.log("Proyecto agregado correctamente");
            } catch (error) {
                console.error("Error al agregar proyecto:", error);
                setError("Error al agregar proyecto");
            } finally{
                setIsSubmitting(false);
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
                    disabled={isSubmitting} //Deshabilita mientras se envía
                />
                {validator.message('nombre', form.nombre, 'required|alpha')}
            </div>
            <div>
                <label>Descripción:</label>
                <input
                    type="text"
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    disabled={isSubmitting} //Deshabilita mientras se envía
                />
                {validator.message('descripcion', form.descripcion, 'required|min:10')}
            </div>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Agregando...' : 'Agregar Proyecto'}</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}


// Componente para listar los proyectos agregados
function ListaProyectos({ proyectos, deleteProyecto }) {
    return (
        <React.Fragment>
            {proyectos.length > 0 ? (
                <ul>
                    {proyectos.map((proyecto, index) => (
                        <li key={proyecto.id || index}>
                            {proyecto.nombre} - {proyecto.descripcion}
                            <button onClick={() => deleteProyecto(proyecto.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>La lista de Proyectos está vacía.</p>
            )}
        </React.Fragment>
    );
}

function ProyectManagementApp() {
    const [proyectos, setProyectos] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        // Escuchar los cambios en la colección de proyectos en tiempo real
        const unsubscribe = onSnapshot(collection(db, "proyectos"), (snapshot) => {
            const proyectosList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProyectos(proyectosList);
        });
        return () => unsubscribe();
    }, []);

    //Funcion para eliminar un proyecto
    const deleteProyecto = async (id) => {
        try {
            await deleteDoc(doc(db, "proyectos", id));
            console.log("Proyecto eliminado correctamente");
        } catch (error) {
            console.error("Error al eliminar proyecto:", error);
        }
    };


    return (
        <div>
            <h1>Gestión de Proyectos</h1>
            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Ocultar formulario' : 'Agregar Proyecto'}
            </button>

            {showForm && <FormularioProyectos addProyecto={(proyecto) => setProyectos([...proyectos, proyecto])} />}
            <ListaProyectos proyectos={proyectos} deleteProyecto={deleteProyecto} />
        </div>
    );
}

export default ProyectManagementApp;
