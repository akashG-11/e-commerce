
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import Product from './Pages/Product';
import ShopCategory from './Pages/ShopCategory';
import LoginSignup from './Pages/LoginSignup';
import Cart from './Pages/Cart';
import Footer from './Components/Footer/Footer';
import building from './Components/Assets/banner_mens.png';
import hardwares from './Components/Assets/banner_women.png';
import tools from './Components/Assets/banner_kids.png';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}></Route>
        <Route path='/building Material' element={<ShopCategory banner={building} category="building Material"/>}></Route>
        <Route path='/hardwares' element={<ShopCategory banner={hardwares} category="hardwares"/>}></Route>
        <Route path='/tools' element={<ShopCategory banner={tools} category="tools"/>}></Route>
        <Route path="/product" element={<Product/>}>
          <Route path=':productId' element={<Product/>}></Route>
        </Route>
      <Route path='/cart' element={<Cart/>}></Route>
      <Route path='/login' element={<LoginSignup/>}></Route>
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
