

const cart = () => {


  // в браузере есть программа api dom, доступная чрез объект document(слепок верстки), 
  // он создается когда интерпретатор считает всю верстку
  const cartBtn = document.querySelector('.button-cart'); // кнпока Открыть корзину

  const cartModal = document.querySelector('#modal-cart'); // модалка

  const closeBtn = cartModal.querySelector('.modal-close'); // кнопка закрытия модалки

  const goodsContainer = document.querySelector('.long-goods-list');
  const cartTable = document.querySelector('.cart-table__goods');
  


  const addToCart = (goodId) => {

    const goods = localStorage.getItem('goods') ? JSON.parse(localStorage.getItem('goods')) : "[]";
    console.log('goods ', goods);

  
    const goodObj = goods.find((goodItem) => goodItem.id === goodId);
    console.log('goodObj ', goodObj);
  
    const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    console.log('cart ', cart);


    console.log('cart.some((cartElem) => cartElem.id === goodObj.id) ', cart.some((cartElem) => cartElem.id === goodObj.id))


    if(cart.some((cartElem) => cartElem.id === goodObj.id)){ // если товар  уже есть в корзине
      cart.map((cartElem) => {
        if(cartElem.id === goodObj.id){   // если добавляемый элемент уже есть в корзине
          cartElem.count += 1; // добавляем свойство count
        }
        return cartElem; // {id, name, decription, img,  count } или {id, name, decription, img}
      }) 
      console.log('cart after add count ', cart) // [ {id, name, decription, img, count }, {id, name, decription, img} ]
    } else{
      goodObj.count = 1; // добавляем свойство count
      cart.push(goodObj);
    }


    localStorage.setItem('cart', JSON.stringify(cart)); // помещаем обнолвенный массив cart в сториж
  };


  const renderCartGoods = (cartArray) => {
    cartTable.innerHTML = '';

    cartArray.forEach(cartElem => {
      const tr = document.createElement('tr');
      tr.innerHTML += `
        <td>${cartElem.name}</td>
				<td>${cartElem.price}</td>
				<td><button class="cart-btn-minus">-</button></td>
        <td class="cart-count">${cartElem.count}</td>
        <td><button class="cart-btn-plus">+</button></td>
        <td>${+cartElem.price * +cartElem.count}</td>  <!-- + приводит сроку к числу --> 
         <td><button class="cart-btn-delete">x</button></td> 
      `
      cartTable.append(tr);

      tr.addEventListener('click', (evt) => { // обработчик повесили не на кнпоку а на  ее родителя(делегирование события)
       // console.log('evt.taret ', evt.target)
        if(evt.target.classList.contains('cart-btn-minus')){
          if(+cartElem.count === 0){
            cartElem.count = 0;
            tr.querySelector('.cart-count').textContent = 0;
          } else{
            cartElem.count -= 1;
            tr.querySelector('.cart-count').textContent = cartElem.count;
          }
        }
        if(evt.target.classList.contains('cart-btn-plus')){
          cartElem.count += 1;
          tr.querySelector('.cart-count').textContent = cartElem.count;
        }

        //localStorage.setItem('cart', ) // обновить сторидж
      });
    });

    const total = document.querySelector('.card-table__total');
    const totalSum = cartArray.reduce((sum, cartItem) => {
      return  sum + cartItem.count * cartItem.price;
    }, 0);

    total.textContent = totalSum;
  };


  cartBtn.addEventListener('click', () => {
    const cartArray = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    renderCartGoods(cartArray);
    

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