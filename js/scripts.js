const items = document.getElementById('items');
const categorias = document.getElementById('categorias');
const templateCard = document.getElementById('template-card').content;
const fragment = document.createDocumentFragment();

document.addEventListener('DOMContentLoaded', ()=>{
    obtenerData();
    obtenerCategorias();
});

items.addEventListener('click', e=>{
    addCarrito(e);
});

const obtenerData = async () => {
    try{
        const res = await fetch('https://test-api-bsale.herokuapp.com/api/Product');
        const data = await res.json();        
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
const resultadoBusqueda = async busqueda =>{
    try{
        const res = await fetch('https://test-api-bsale.herokuapp.com/api/Product/'+busqueda);
        const data = await res.json();
        console.log(data);
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
        /*
        if(producto.discount != '0'){
            //REVISAR ESTO            
            templateCard.querySelector('p').classList = "text-decoration-line-through";            
            var precio = producto.price * (100 - producto.discount)/100;
            templateCard.querySelector('span').textContent = precio;
        }
        else{
            templateCard.querySelector('p').textContent = producto.price;
        }
        */
        templateCard.querySelector('p').textContent = producto.price;
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
        console.log(obtenerProducto(e.target.dataset.id));
    }
    e.stopPropagation();
}

const setCarrito = objeto =>{
    console.log(objeto);
}