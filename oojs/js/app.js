let products;
let brandsArr = [];
// to fetch JSON Data
fetch(`../js/json/data.json`)
  .then(function(response) {
    return response.json();
  })
  .then(function(res) {
    products = res;
    listing.createTemplate(res);
  })
  .catch(error => console.error('Error:', error));

  let listing = {
    createTemplate: (res) => {
      let outputTemplate = '';
       res.map((product)=>{
        outputTemplate += listing.productTemplate(product)        
      })
      
        document.getElementById('listing').innerHTML = outputTemplate;        
    },
    productTemplate:(data) => {
      return `<div class="col-md-3 col-sm-6">
        <div class="product-grid">
            <div class="product-image">
                <a href="#">
                    <img class="pic-1" src="${data.imageUrl}">                    
                </a>
                
                <span class="product-new-label">sale</span>
                <span class="product-discount-label">${data.starRating} *</span>
            </div>
            
            <div class="product-content">
                <h3 class="title"><a href="#">${data.productName}</a></h3>
                <div class="price">${data.price}
                    <span>$20.00</span>
                </div>
                <button class="add-to-cart" onclick="addToCart(${data.productId})">Add To Cart</button>
            </div>
        </div>
    </div>`
    },filter:(id,divid)=>{
    
     document.getElementById(divid).checked ? listing.brandUpdate(id,true) : listing.brandUpdate(id,false);

     let filterdProducts = []
       products.forEach((product) => {
          brandsArr.forEach(el=>{
           if(el === product.brand){
            filterdProducts.push(product) 
           }
          })
        })
        filterdProducts.length > 0 ? listing.createTemplate(filterdProducts):listing.createTemplate(products);
      
      },brandUpdate:(id,status) => {
        if(status){
          brandsArr.push(id)
        }else{
          brandsArr = brandsArr.filter((brandId) => {
                  return id !== brandId
              })
        }
      },filterPrice:()=>{
        let minPrice = document.getElementById('price-min').value;
        let maxPrice = document.getElementById('price-max').value;
        let filterdProducts = products.filter((product) => {
            return product.price < maxPrice && product.price > minPrice
        })
        
        listing.createTemplate(filterdProducts);
      },
      cartTemplate:(data) => {
        return `<tr>
                            <td><img src="${data.imageUrl}" /> </td>
                            <td>${data.productName}</td>
                          
                            <td><input onkeyup="updatePrice(${data.productId})" id="${data.productId}" onchange="updatePrice(${data.productId})" class="form-control" type="number" value="1" min="1" max="5" /></td>
                            <td class="text-right">${data.price}</td>
                            <td class="text-right"><button class="btn btn-sm btn-danger" onclick="deleteItem(${data.productId})"><i class="fa fa-trash"></i> </button> </td>
                        </tr>`
    }

  }



class cartItem{
    constructor(cart) {
      this.productId = cart.productId;
      this.productName = cart.productName;
      this.price = cart.price;
      this.imageUrl = cart.imageUrl;
    }
}

let cartArr = []

addToCart = (itemId) => {

 let currProduct =  products.filter((prod)=>{
                      return prod.productId === itemId
                   })

let currCartItem = new cartItem(currProduct[0]);

cartArr.push(currCartItem);

document.getElementById('cartcount').innerHTML = cartArr.length;
localStorage.cartItems = JSON.stringify(cartArr);
}

loadCartItems = () => {
  let cartItems = JSON.parse(localStorage.cartItems)
  document.getElementById('cartcount').innerHTML = cartItems.length;
  let cartItemTemp = ''
  let totalPrice = 0;
  cartItems.map((item)=>{
    cartItemTemp += listing.cartTemplate(item)
    totalPrice += item.price
  })
  document.getElementById('cartItems').innerHTML = cartItemTemp;
  document.getElementById('total').innerHTML = totalPrice;

}

loadCartItems();

deleteItem = (prodId) => {
  let cartItems = JSON.parse(localStorage.cartItems)
 let currCartItem =  cartItems.filter((item)=>{
    return item.productId !== prodId
  })

localStorage.cartItems = JSON.stringify(currCartItem);
loadCartItems();
}

updatePrice = (prodId) => {
  let cartItems = JSON.parse(localStorage.cartItems);
  let currQty = document.getElementById(prodId).value;

  let totalPrice = 0;
  cartItems.map((item)=>{
   if(item.productId === prodId){
      totalPrice += item.price * currQty;
   }else{
      totalPrice += item.price
   }
  })

  document.getElementById('total').innerHTML = totalPrice;

}



