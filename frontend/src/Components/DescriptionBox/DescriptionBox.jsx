import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
            <div className="descriptionbox-navigator">
                <div className="descriptionbox-nav-box">Description</div>
                <div className="descriptionbox-nav-box fade">Reviews (122)</div>
            </div>
            <div className="descriptionbox-description">
                <p>Durable and reliable hardware products, ideal for construction, repair, and DIY projects. Sourced from trusted brands to ensure quality, performance, and ease of use across all applications.</p>
                <p>Our hardware products are designed to meet the needs of professionals and DIY enthusiasts alike. With a focus on durability and reliability, we offer a wide range of tools, fasteners, and accessories to help you get the job done right.</p>
            </div>
    </div>
  )
}

export default DescriptionBox