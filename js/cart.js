



const cart = () => {


  // в браузере есть программа api dom, доступная чрез объект document(слепок верстки), 
  // он создается когда интерпретатор считает всю верстку
  const cartBtn = document.querySelector('.button-cart'); // кнпока Открыть корзину

  const cartModal = document.querySelector('#modal-cart'); // модалка

  const closeBtn = cartModal.querySelector('.modal-close'); // кнопка закрытия модалки

  const goodsContainer = document.querySelector('.long-goods-list');


  const addToCart = (goodId) => {

    const goods = localStorage.getItem('goods') ? JSON.parse(localStorage.getItem('goods')) : [];
    console.log('goods ', goods);

  
    const goodObj = goods.find((goodItem) => goodItem.id === goodId);
    console.log('goodObj ', goodObj);
  
    const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    console.log('cart ', cart);


    const elem = cart.find((cartElem) => cartElem.id === goodObj.id); // c some() тоже рабтает  cart.some((cartElem) => cartElem.id === goodObj.id);
    console.log('elem ', elem);

    
    if(elem){
      elem.сount +=1; // если товар  уже есть в корзине
    } else{
      goodObj.count = 1; // добавляем свойство count
      cart.push(goodObj);
    }


    localStorage.setItem('cart', JSON.stringify(cart)); // помещаем обнолвенный массив cart в сториж
  };




  cartBtn.addEventListener('click', () => {

    cartModal.style.display = 'flex';
  });


  closeBtn.addEventListener('click', () => {
    cartModal.style.display = '';
  });


  
  

  if(goodsContainer){
    goodsContainer.addEventListener('click', (evt) => {  // делегиронаие собтий,  когда обраотчик навесили на родителя
      console.log('evt.target ', evt.target)

      if(evt.target.closest('.add-to-cart')){ // если у элемента или его родителя есть класс такой
        const addToCartbtn = evt.target.closest('.add-to-cart');
        //console.log('addToCartbtn ', addToCartbtn);
        const goodId = addToCartbtn.dataset.id;
        console.log('id ', goodId);
        addToCart(goodId);
      }
    });
  }
}


cart(); // инкапуслировали код