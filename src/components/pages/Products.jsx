
import React from 'react'

export function Products({ products }){
  return(
    <ul>
    {products.map(product=>{
      return(                    
        <li key={product.id} className='card'>
        <img src={product.image} alt={product.name} />
        <div>
          <strong>{product.name}</strong>- ${product.price}
        </div>
        <div>
          <button>                          
            <i className="fas fa-shopping-basket" />
            <sup><i className="fas fa-plus nav-icon" /></sup>
          </button>
        </div>
      </li>)
    })}                
  </ul> )

}
