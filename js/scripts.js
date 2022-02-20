const items = document.getElementById('items');
const itemsCarrito = document.getElementById('items-carrito');
const footer = document.getElementById('footer');
const categorias = document.getElementById('categorias');
const categoriasMenu = document.getElementById('categorias-menu');
const templateCard = document.getElementById('template-card').content;
const templateCarrito = document.getElementById('template-carrito').content;
const templateFooter = document.getElementById('template-footer').content;
const buscador = document.getElementById('buscador');
const carritoMenu = document.getElementById('carrito-menu');
const fragment = document.createDocumentFragment();
var carrito = {};

document.addEventListener('DOMContentLoaded', ()=>{
    obtenerData();
    obtenerCategorias();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
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

itemsCarrito.addEventListener('click', e => {
    btnAccion(e);
})

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
        templateCard.querySelector('button').dataset.name = producto.name;
        templateCard.querySelector('button').dataset.url_Image = producto.url_Image;
        templateCard.querySelector('button').dataset.price = producto.price;
        templateCard.querySelector('button').dataset.discount = producto.discount;

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
        const producto = {
            id: e.target.dataset.id,
            name: e.target.dataset.name,
            url_image: e.target.dataset.url_Image,
            price: e.target.dataset.price * (100 - e.target.dataset.discount)/100,
            cantidad: 1
        }
        if (carrito.hasOwnProperty(producto.id)) {
            producto.cantidad = carrito[producto.id].cantidad + 1;
        }
        carrito[producto.id] = {...producto}        
        pintarCarrito();
    }
    e.stopPropagation();
}

const pintarCarrito = () =>{
    itemsCarrito.innerHTML = '';
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id;        
        templateCarrito.querySelectorAll('td')[0].textContent = producto.name;        
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;        
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id;        
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;        
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.price;
        
        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    })
    itemsCarrito.appendChild(fragment);

    pintarFooter();

    localStorage.setItem('carrito', JSON.stringify(carrito));
}

const pintarFooter = () => {
    footer.innerHTML = '';
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `      
        return; 
    }

    const nCantidad = Object.values(carrito).reduce((acumulador, {cantidad})=> acumulador + cantidad,0);
    const nPrecio = Object.values(carrito).reduce((acumulador, {cantidad, price})=> acumulador + (cantidad * price),0);

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    carritoMenu.querySelector('span').textContent = nCantidad;

    const btnVaciar = document.getElementById('vaciar-carrito');
    btnVaciar.addEventListener('click', () =>{
        carrito = {};
        pintarCarrito();
        carritoMenu.querySelector('span').textContent = 0;
    })
}

const btnAccion = e =>{
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[e.target.dataset.id] = {...producto};
        pintarCarrito();
    }
    
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id];
        }
        pintarCarrito();
    }

    e.stopPropagation();
}