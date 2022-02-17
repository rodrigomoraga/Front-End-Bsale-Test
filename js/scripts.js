const items = document.getElementById('items');
const templateCard = document.getElementById('template-card').content;
const fragment = document.createDocumentFragment();

document.addEventListener('DOMContentLoaded', ()=>{
    fetchData();
});

const fetchData = async () => {
    try{
        const res = await fetch('https://test-api-bsale.herokuapp.com/api/Product');
        const data = await res.json();        
        pintarCards(data);
    }catch (error){
        console.log(error);
    }
}

const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.name;
        templateCard.querySelector('img').setAttribute('src', producto.url_Image);
        templateCard.querySelector('img').setAttribute('alt', producto.name);
        templateCard.querySelector('p').textContent = producto.price;

        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);
}