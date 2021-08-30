import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux'
import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import { selectCurrentCategory, selectProducts, updateProducts } from './productListSlice';
import spinner from '../../assets/spinner.gif';

function ProductList() {
  const currentCategory = useSelector(selectCurrentCategory);
  const products = useSelector(selectProducts);
  const dispatch = useDispatch();
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (data) {
      // store it in redux store
      dispatch(updateProducts(data.products));

      // also store each product in IndexedDB
      data.products.forEach(product => {
        idbPromise('products', 'put', product);
      });

    } else if (!loading) {
      // offline, so get data from the 'products' store in IndexedDB
      idbPromise('products', 'get').then(products => {
        // put 'em  into global state
        dispatch(updateProducts(products));
      });
    }
  }, [data, loading, dispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return products;
    }

    return products.filter(product => product.category._id === currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
