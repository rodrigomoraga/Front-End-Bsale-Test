const items = document.getElementById('items');
const categorias = document.getElementById('categorias');
const templateCard = document.getElementById('template-card').content;
const fragment = document.createDocumentFragment();
const buscador = document.getElementById('buscador');
var carrito = {};

document.addEventListener('DOMContentLoaded', ()=>{
    //obtenerData();
    obtenerProductoPorCategoria(1);
    obtenerCategorias();
});

items.addEventListener('click', e=>{
    addCarrito(e);
});

buscador.addEventListener('submit', event =>{
    event.preventDefault();
    var input = document.getElementById('inputBuscador').value;
    if (input) {
        buscadorPorPalabra(input);    
    }
    else{
        obtenerData();
    } 
});

const obtenerData = async () => {
    try{
        const res = await fetch('https://test-api-bsale.herokuapp.com/api/Product');
        const data = await res.json();
        limpiarPantalla();        
        pintarCards(data);
    }catch (error){
        console.log(error);
    }
}

const obtenerProducto = async id =>{
    try{
        const res = await fetch('https://test-api-bsale.herokuapp.com/api/Product/'+id);
        const data = await res.json();        
        console.log(data);
    }catch (error){
        console.log(error);
    }
}

const obtenerProductoPorCategoria = async id =>{
    try{
        const res = await fetch('https://test-api-bsale.herokuapp.com/api/Product/Category/'+id);
        const data = await res.json();
        limpiarPantalla();
        pintarCards(data);
    }catch (error){
        console.log(error);
    }
}

const obtenerCategorias = async () =>{
    try{
        const res = await fetch('https://test-api-bsale.herokuapp.com/api/Category');
        const data = await res.json();
        pintarCategorias(data);
    } catch (error){
        console.log(error);
    }
}

const filtrarPorCategoria = async id =>{
    try{
        const res = await fetch('https://test-api-bsale.herokuapp.com/api/Category/'+id);
        const data = await res.json();
        pintarCategorias(data);
    } catch (error){
        console.log(error);
    }
}

//buscar por palabra
const buscadorPorPalabra = async busqueda =>{
    try{
        const res = await fetch('https://test-api-bsale.herokuapp.com/api/Product/Search/'+busqueda);
        const data = await res.json();
        limpiarPantalla();
        pintarCards(data);
    }catch(error){
        console.log(error);
    }    
}

const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.name;
        if(producto.url_Image){
            templateCard.querySelector('img').setAttribute('src', producto.url_Image);    
        }
        else{
            templateCard.querySelector('img').setAttribute('src', 'https://programacion.net/files/article/20161110041116_image-not-found.png');
        }        
        templateCard.querySelector('img').setAttribute('alt', producto.name);
        templateCard.querySelector('p').textContent = "$" + producto.price;

        if(producto.discount == '0'){                                                
            
            templateCard.querySelector('p').classList = "";       
            templateCard.querySelector('span').textContent = "";     
        }
        else{                      
            var precioDescuento = producto.price * (100 - producto.discount)/100;            
            templateCard.querySelector('p').classList = "text-decoration-line-through";
            templateCard.querySelector('span').textContent = "Precio Descuento: $" + precioDescuento;                            
        }    
        templateCard.querySelector('button').dataset.id = producto.id;

        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);
}

const pintarCategorias = data =>{
    data.forEach(categoria =>{
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.classList = 'dropdown-item';
        a.innerText = categoria.name;
        a.addEventListener('click', ()=>{
            obtenerProductoPorCategoria(categoria.id);
        });
        li.appendChild(a);
        categorias.appendChild(li);
    });

}

const limpiarPantalla = () =>{
    try{
        items.innerHTML = '';
    }catch (error){
        console.log(error);
    }
}

const addCarrito = e =>{
    if(e.target.classList.contains('btn-outline-dark')){
        const objeto = obtenerProducto(e.target.dataset.id);

    }
    e.stopPropagation();
}

const setCarrito = objeto =>{
    console.log(objeto);
}