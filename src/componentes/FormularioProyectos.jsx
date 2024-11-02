import React, { useState, useEffect } from "react";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import { db } from '../firebase';
import { collection, addDoc, onSnapshot } from "firebase/firestore";

// Componente para el formulario de proyectos
function FormularioProyectos({ addProyecto }) {
    const [form, setForm] = useState({ nombre: '', descripcion: '' });
    const [validator] = useState(new SimpleReactValidator());
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validator.allValid()) {
            try {
                const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
                const additionalData = response.data;
                const proyectoConDatos = { ...form, additionalInfo: additionalData.title };

                await addDoc(collection(db, "proyectos"), proyectoConDatos);
                addProyecto(proyectoConDatos);

                // Limpiar el formulario
                setForm({ nombre: '', descripcion: '' });
                validator.hideMessages();
                setError(null);
            } catch (error) {
                console.error("Error al agregar proyecto:", error);
                setError("Error al agregar proyecto");
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
                {validator.message('descripcion', form.descripcion, 'required|min:10')}
            </div>
            <button type="submit">Agregar Proyecto</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}


// Componente para listar los proyectos agregados
function ListaProyectos({ proyectos }) {
    return (
        <React.Fragment>
            {proyectos.length > 0 ? (
                <ul>
                    {proyectos.map((proyecto) => (
                        <li key={proyecto.id}>
                            {proyecto.nombre} - {proyecto.descripcion}
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

        // Detener la escucha cuando el componente se desmonta
        return () => unsubscribe();
    }, []);

    return (
        <div>
            <h1>Gestión de Proyectos</h1>
            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Ocultar formulario' : 'Agregar Proyecto'}
            </button>

            {showForm && <FormularioProyectos addProyecto={(proyecto) => setProyectos([...proyectos, proyecto])} />}
            <ListaProyectos proyectos={proyectos} />
        </div>
    );
}

export default ProyectManagementApp;
