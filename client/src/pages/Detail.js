import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux'
import { selectCart, addToCart, updateCartQuantity, removeFromCart } from '../components/Cart/cartSlice';
import { selectProducts, updateProducts } from '../components/ProductList/productListSlice';
import { QUERY_PRODUCTS } from '../utils/queries';
import { idbPromise } from '../utils/helpers';
import Cart from '../components/Cart';
import spinner from '../assets/spinner.gif';

function Detail() {
  const products = useSelector(selectProducts);
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();

  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({});

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const addItemToCart = () => {
    const itemInCart = cart.find(cartItem => cartItem._id === id);

    if (itemInCart) {
      dispatch(updateCartQuantity({
        _id: itemInCart._id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      }));
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      const { category, description, __typename, ...productForCart } = currentProduct;
      dispatch(addToCart({ ...productForCart, purchaseQuantity: 1 }));
      idbPromise('cart', 'put', { ...productForCart, purchaseQuantity: 1 });
    }
  };

  const removeItemFromCart = () => {
    dispatch(removeFromCart({ _id: currentProduct._id }));
    idbPromise('cart', 'delete', { ...currentProduct });
  };

  useEffect(() => {
    if (products.length) {
      setCurrentProduct(products.find((product) => product._id === id));
    }
    // retrieved from server
    else if (data) {
      dispatch(updateProducts(data.products));

      data.products.forEach(product => {
        idbPromise('products', 'put', product);
      });
    }
    // get from idb
    else if (!loading) {
      idbPromise('products', 'get').then(indexedProducts => {
        dispatch(updateProducts(indexedProducts));
      });
    }
  }, [products, loading, data, dispatch, id]);

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={() => addItemToCart()}>Add to Cart</button>
            <button
              disabled={!cart.find(p => p._id === currentProduct._id)}
              onClick={removeItemFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
