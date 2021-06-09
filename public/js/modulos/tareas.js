import axios from "axios";
import Swal from 'sweetalert2';
import {actualizarAvance} from '../funciones/avance';


const tareas = document.querySelector('.listado-pendientes');

if(tareas) {

    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            // console.log(idTarea);

            // Request hacia /tarea/:id
            const url = `${location.origin}/tareas/${idTarea}`;

            // console.log(url);

            axios.patch(url, { idTarea })
                .then( function(respuesta){
                    // console.log(respuesta)
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })
        }


        if(e.target.classList.contains('fa-trash')) {
            
            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;

            // console.log(tareaHTML);
            // console.log(idTarea);

            Swal.fire({
                title: 'Deseas borrar esta Tarea?',
                text: "Una tarea eliminado no se puede recuperar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar',
                cancelButtonText: 'No, cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                    //enviar el delete por axios

                    const url = `${location.origin}/tareas/${idTarea}`;
                    axios.delete(url, { params: {idTarea}})
                        .then(function(respuesta){
                            if(respuesta.status === 200) {

                                //eliminar nodo del dom
                                tareaHTML.parentElement.removeChild(tareaHTML);

                                //emitir alerta
                                Swal.fire(
                                    'Tarea Eliminada',
                                    respuesta.data,
                                    'success'
                                );
                                actualizarAvance();
                            }
                        })
                }
            })
        }
    });

}

export default tareas;