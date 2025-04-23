const search = () => {


  const input = document.querySelector('.search-block > input');
  const searchBtn = document.querySelector('.search-block > button');


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



  const getData = (inputValue) => {

    fetch('db/db.json')
      .then((response) => { // then отработате толда когда данные придут от сервера
        //console.log('esponse.json() ', response.json())
        return response.json(); // Promise
      })
      .then((data) => { 
        const array = data.filter((item) => { 
          return item.name.toLowerCase().includes(inputValue.toLowerCase()); // в одной строке ищем подстроку
        });
        

        localStorage.setItem('goods', JSON.stringify(array));
                
        if(window.location.pathname !== '/goods.html'){
          window.location.href = '/goods.html';   // переводим на эту страницу
        }
        else{
          renderGoods(array);
        }

        
      });
  };
  




  try{
    searchBtn.addEventListener('click', () => {
      getData(input.value);
      input.value = '';
    });
  }catch(error){
    //console.dir(error)
    console.error(error.message);
  }

 
}


search();  // инкапуслировали код