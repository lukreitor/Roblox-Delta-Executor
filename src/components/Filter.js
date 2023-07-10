import React, { useContext, useEffect, useState } from 'react'
import { RoutesContext } from '../context/RoutesContext'
import { useFetchCRUD } from '../hooks/useFetchCRUD';

import './Filter.css'

const Filter = ({filter, setFilter, categories:categoriesProp}) => {
  const { urls } = useContext(RoutesContext);
  const { data:categoriesImport } = useFetchCRUD(urls.category);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if(categoriesProp){
      setCategories([...categoriesProp]);
    } else {
      setCategories([...categoriesImport]);
    }
  }, [categoriesImport, categoriesProp])

  categories.sort((a,b) => {return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0});

  return (
    <div className='filter-bg d-flex justify-content-center justify-content-lg-start align-items-center'>
        <ul className='d-flex flex-row align-items-center flex-wrap justify-content-center'>
          <li className={filter === 'todos' ? 'active' : ''} onClick={() => {setFilter('todos');}}>Todos</li>
            {categories && categories.sort().map((category) => <li key={category.id} className={filter === category.name ? 'active' : ''} onClick={() => {setFilter(category.name);}}>{category.name}</li>)}
        </ul>
    </div>
  )
}

export default Filter