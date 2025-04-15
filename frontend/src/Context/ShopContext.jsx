import React, {createContext, useEffect} from "react";

import { useState } from "react";


export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let i = 1; i < 300 + 1; i++) {
        cart[i] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {

    const[all_product,setAll_Product] = useState([]);

    const [cartItems,setCartItems] = useState(getDefaultCart());
    useEffect(()=>{
        fetch('https://e-commerce-backend-chhq.onrender.com')
        .then((response)=>response.json())
        .then((data)=>setAll_Product(data))

        if(localStorage.getItem('auth-token')){
            fetch('https://e-commerce-backend-chhq.onrender.com',{
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:"{}",
            }).then((response)=>response.json())
            .then((data)=>setCartItems(data))
        }
    },[])
    
    const addToCart = (ItemId) => {
        setCartItems((prev)=>({...prev,[ItemId]:prev[ItemId]+1}))
        if(localStorage.getItem('auth-token')){
            fetch('https://e-commerce-backend-chhq.onrender.com',{
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":ItemId}),
            })
            .then((response)=>response.json())
            .then((data) => console.log(data.message))
        }
    } 
    const removeFromCart = (ItemId) => {
        setCartItems((prev)=>({...prev,[ItemId]:prev[ItemId]-1}))
        if(localStorage.getItem('auth-token')){
            fetch('https://e-commerce-backend-chhq.onrender.com',{
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":ItemId}),
            })
            .then((response)=>response.json())
            .then((data) => console.log(data.message))
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                let itemInfo = all_product.find((product)=>product.id===Number(item));
                totalAmount += itemInfo.new_price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () => {
        let  totalItem = 0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }


    const contextValue = {all_product,cartItems,addToCart,removeFromCart,getTotalCartAmount,getTotalCartItems};
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}    

export default ShopContextProvider;
