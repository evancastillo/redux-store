import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import {
  selectCategories,
  updateCategories,
  updateCurrentCategory
} from './categoryMenuSlice';

function CategoryMenu() {
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    // if category data exists or has been updated by useQuery, run dispatch()
    if (categoryData) {
      // execute dispatch function to update store
      dispatch(updateCategories(categoryData.categories));

      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });

    } else if (!loading) {
      idbPromise('categories', 'get').then(categories => {
        dispatch(updateCategories(categories));
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = id => {
    dispatch(updateCurrentCategory(id));
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
