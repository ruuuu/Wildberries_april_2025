const getGoods = () => {

  const links = document.querySelectorAll('.navigation-link');
  const moreBtn = document.querySelector('.more');

  const renderGoods = (goods) => {
    console.log('goods ', goods)

    const goodsContainer = document.querySelector('.long-goods-list');
    goodsContainer.innerHTML = '';

    goods.forEach((goodItem) => {
      const goodBlock = document.createElement('div');
      goodBlock.classList.add('col-lg-3', 'col-sm-6');
      goodBlock.innerHTML = `
        <div class="goods-card">
						<span class="label ${goodItem.label ? null : 'd-none'}">${goodItem.label} </span>
					  <img src="db/${goodItem.img}" alt="image: ${goodItem.name}" class="goods-image">
						<h3 class="goods-title">${goodItem.name}</h3>
						<p class="goods-description">${goodItem.description}</p>
						<button class="button goods-card-btn add-to-cart" data-id="${goodItem.id}">
							<span class="button-price">$${goodItem.price}</span>
						</button>
				</div>
      `;

      goodsContainer.append(goodBlock);
    });

  };




  const getData = (textLink, category) => {

    fetch('db/db.json')
      .then((response) => { // then отработате толда когда данные придут от сервера
        //console.log('esponse.json() ', response.json())
        return response.json(); // Promise
      })
      .then((data) => { 
        console.log('category ', category)

        const array = category ? data.filter((item) => item[category] === textLink) : data;
        console.log('array ', array);

        localStorage.setItem('goods', JSON.stringify(array));
                
        if(window.location.pathname !== '/goods.html'){
          window.location.href = '/goods.html';   // переводим на эту страницу
          
        }else{
          renderGoods(array);
        }
      });
  };



  links.forEach((link) => {

    link.addEventListener('click', (evt) => {
      evt.preventDefault();
      const textLink = link.textContent;
      const category = link.dataset.field; // получили значение дата атрибута data-field=gender или category
      console.log('category ', category)
      getData(textLink, category);
    });
  });

  if(localStorage.getItem('goods') && window.location.pathname === '/goods.html'){ // рендерим только на goods.html
    renderGoods(JSON.parse(localStorage.getItem('goods'))); // переводим из строки
  }

  
  if(moreBtn){
    moreBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      getData();
    });
  }

}



getGoods();
