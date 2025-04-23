const cart = () => {


  // в браузере есть программа api dom, доступная чрез объект document(слепок верстки), 
  // он создается когда интерпретатор считает всю верстку
  const cartBtn = document.querySelector('.button-cart'); // кнпока Открыть корзину
  const cartModal = document.querySelector('#modal-cart'); // модалка
  const closeBtn = cartModal.querySelector('.modal-close'); // кнопка закрытия модалки
  const goodsContainer = document.querySelector('.long-goods-list');
  const cartTable = document.querySelector('.cart-table__goods');
  const modalForm = document.querySelector('.modal-form');


  const deleteCartItem = (id) => { // id удаляемго элемента
    const cart = JSON.parse(localStorage.getItem('cart'));
    const newCart = cart.filter((cartGood) => {
      return cartGood.id !== id;
    });

    localStorage.setItem('cart', JSON.stringify(newCart)); // обновляем сторидж
    renderCartGoods(JSON.parse(localStorage.getItem('cart'))); // перереедриваем корзину
  };


  const plusCartItem = (id) => { // добавляемого элемента в корзину
    const cart = JSON.parse(localStorage.getItem('cart'));
    // const good = cart.find((cartGood) => {
    //   return cartGood.id === id;
    // });
    // if(good){
    //   good.count += 1;
    // }else{
    //   cart.push(good);
    //   good.count = 0;
    // }   

    // или:
    const newCart = cart.map((cartElem) => {
      if(cartElem.id === id){   // если добавляемый элемент уже есть в корзине
        cartElem.count += 1; // добавляем свойство count
      }
      return cartElem; // {id, name, decription, img,  count } или {id, name, decription, img}
    }); 
    
    localStorage.setItem('cart', JSON.stringify(newCart)); // запишем обновленный cart
    renderCartGoods(JSON.parse(localStorage.getItem('cart'))); // перерисовываем корзину
  };



  const minusCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem('cart'));

    const newCart = cart.map((cartElem) => {
      if(cartElem.id === id){   // если добавляемый элемент уже есть в корзине
        if(cartElem.count > 0){
          cartElem.count -= 1; // добавляем свойство count
        }
      }

      return cartElem; // {id, name, decription, img,  count } или {id, name, decription, img}
    }); 

    localStorage.setItem('cart', JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem('cart'))); // перерисовываем корзину
  };




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
      }); 
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
          // if(+cartElem.count === 0){
          //   cartElem.count = 0;
          //   tr.querySelector('.cart-count').textContent = 0;
          // } else{
          //   cartElem.count -= 1;
          //   tr.querySelector('.cart-count').textContent = cartElem.count;
          // }
          minusCartItem(cartElem.id);
        }
        if(evt.target.classList.contains('cart-btn-plus')){
          //cartElem.count += 1;
          plusCartItem(cartElem.id);
          //tr.querySelector('.cart-count').textContent = cartElem.count;
        }
        if(evt.target.classList.contains('cart-btn-delete')){
          deleteCartItem(cartElem.id);
          //tr.remove();
        }
      });
    }); // forEach

    const total = document.querySelector('.card-table__total');
    const totalSum = cartArray.reduce((sum, cartItem) => {
      return  sum + cartItem.count * cartItem.price;
    }, 0);

    total.textContent = totalSum;
  };



  const sendForm = () => {
    const cartArray = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({ 
        cart: cartArray ,
        name: modalForm.nameCustomer.value, // nameCustomer значение атрибута name у поля
        phone: modalForm.phoneCustomer.value,
      })
    })
    .then(() => {
      cartModal.style.display = '';
      localStorage.setItem('cart', [])
    });
    
  }

  

  modalForm.addEventListener('submit', (evt) => {
      evt.preventDefault();
      sendForm();
      modalForm.reset(); // очистка формы после отправки
  });


  cartBtn.addEventListener('click', () => {
    const cartArray = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    renderCartGoods(cartArray);
    

    cartModal.style.display = 'flex';
  });


  closeBtn.addEventListener('click', () => {
    cartModal.style.display = '';
  });


  cartModal.addEventListener('click', (evt) => {
    if(!evt.target.closest('.modal') && evt.target.classList.contains('overlay')){
      cart.style.display = '';
    }
  });


  window.addEventListener('keydown', (evt) => {
    if(evt.key === 'Escape'){
      cart.style.display = '';
    }
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