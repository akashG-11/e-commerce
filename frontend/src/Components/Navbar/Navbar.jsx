import React, { useContext, useState } from 'react' 
import './Navbar.css'
import { ShopContext } from '../../Context/ShopContext'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
const Navbar = () => {
  
    const [menu,setMenu] = useState("shop");
    const {getTotalCartItems} = useContext(ShopContext);
  return (
    <div className='navbar'>
        <div className="nav-logo">
            <img src={logo} alt="" />
            <p>Hardware store</p>
        </div>
        <ul className="nav-menu">
            <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration: 'none'}} to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("building Material")}}><Link style={{textDecoration: 'none'}} to='/building Material'>Building Material</Link>{menu==="building Material"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("hardwares")}}><Link style={{textDecoration: 'none'}} to='/hardwares'>Hardwares</Link>{menu==="hardwares"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("tools")}}><Link style={{textDecoration: 'none'}} to='/tools'>Tools</Link>{menu==="tools"?<hr/>:<></>}</li>
        </ul>
        <div className="nav-login-cart">
            {localStorage.getItem('auth-token')
            ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace("/")}}>Logout</button>
            :<Link to='/login'><button>Login</button></Link>}
            <Link to='/cart'><img src={cart_icon} alt="" /></Link>
            <div className="nav-cart-count">{getTotalCartItems()}</div>
            
        </div>
    </div>
  )
}

export default Navbar