import { useId } from 'react';
import {categories} from '../../mocks/categories.js';
import { useFilters } from '../../hooks/useFilters.jsx';

export function Filters () {
  const {setFilters}= useFilters()
  const categoryFilterId = useId()

  const handleChangeCategory = (event)=>{
    setFilters(prevState=>({
      ...prevState,
      category:event.target.value
    }))
  }

  return (
    <section className='filters'>
      <div></div>
      <div>
        <label htmlFor={categoryFilterId}>Categoría</label>
        <select id={categoryFilterId} onChange={handleChangeCategory}>
          <option value='all'>TODAS</option>
          {categories.map(categ=>{
            return (
              <option key={categ.id} value={categ.name} >{categ.name.toUpperCase() }</option>
            )
          })}
        </select>
      </div>

    </section>

  )
}
