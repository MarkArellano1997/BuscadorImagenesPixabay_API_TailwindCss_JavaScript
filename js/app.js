const formulario = document.querySelector('#formulario')
const resultado = document.querySelector('#resultado')
const paginacion = document.querySelector('#paginacion')

const registroPorPagina = 40
let totalPaginas;
let paginaActual = 1
let iterador;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario)
}

function validarFormulario(e) {
    e.preventDefault()

    const termino = document.querySelector('#termino').value.trim()

    if (termino === "") {

        mostrarAlerta('Ingrese el termino de búsqueda');

        return
    }

    obtenerImagenes()

}

function mostrarAlerta(mensaje) {

    const alertaPrevia = document.querySelector('.bg-red-100')

    if (!alertaPrevia) {
        const alerta = document.createElement('P')
        alerta.classList.add("border-red-400", 'bg-red-100', 'text-center', 'w-full', 'mt-4', 'p-2', 'rounded', 'text-red-700')
        alerta.innerHTML =
                    `
                        <strong class="font-bold">Error!</strong>
                        <span class="block sm:inline">${mensaje}</span>
                    `

        formulario.appendChild(alerta)

        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }

}

function obtenerImagenes() {
    
    const termino = document.querySelector('#termino').value.trim()

    const APIkey='45210527-8d093101cf6c582e3dc43b141'

    const url = `https://pixabay.com/api/?key=${APIkey}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits)
            mostrarImagenes(resultado.hits)
        })
}

function mostrarImagenes(imagenes) {

    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }

    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen
        resultado.innerHTML +=
                                `
                                    <div class="w-1/2 md:w-1/3 lg:w-1/4 p-2 mb-4">
                                        <div class="bg-white rounded">
                                            <img src="${previewURL}" class="w-full">
                                            <div class="p-4">
                                                <p class="font-bold">${likes} <span class="font-light">Likes</span></p>
                                                <p class="font-bold">${views} <span class="font-light">Vistas</span></p>
                                                <a class="block w-full bg-blue-800 hover:bg-blue-500 rounded p-1 text-center text-white uppercase" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver imagen</a>
                                            </div>
                                        </div>
                                    </div>
                                `
    });

    while (paginacion.firstChild) {
        paginacion.removeChild(paginacion.firstChild)
    }

    imprimirPaginacion()
}

function *paginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i
        
    }
}

function imprimirPaginacion() {

    iterador = paginador(totalPaginas)

    while (true) {
        const {value, done} = iterador.next()
        if(done) return

        const boton = document.createElement('a')
        boton.href = '#'
        boton.dataset.pagina = value
        boton.textContent = value
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'uppercase', 'rounded')

        boton.onclick = ()=>{
            paginaActual = value
            obtenerImagenes()
        }

        paginacion.appendChild(boton)
    }
}

function calcularPaginas(total) {
    
    return Math.ceil(total/registroPorPagina)
}
