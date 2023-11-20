import { useContext } from "react";
import Modal from "./Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./Input";
import Button from "../componants/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../componants/hooks/useHttp";
import Error from "../componants/Error";
//to avoid infinite loops(*after import useHttp)
const requestConfig = {
    method:'POST',
    headers:{'content-type':'application/json'},
    //here we did not use body, because after submitted the form the we will get body

}
export default function Checkout(){
   const cartCtx =  useContext(CartContext);
   const cartTotalPrice = cartCtx.items.reduce((totalPrice,item)=>{
    return totalPrice+item.quantity*item.price
},0)
//to close the modal
 const userProgressCtx = useContext(UserProgressContext);
const{data,error,isLoading:isSending,sendRequest,clearData}= useHttp('http://localhost:3000/orders',requestConfig)
 function handleCloseModal(){
    userProgressCtx.hideCheckout()
 }
 //to clear cart after submit 
 function handleFinish(){
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData()
 }
 //submit form
 function handleSubmit(e){
    e.preventDefault();
   const fd= new FormData(e.target);
   const customerData = Object.fromEntries(fd.entries());//it gives an object
   sendRequest(
    JSON.stringify({
        order:{items:cartCtx.items,customer:customerData}
      })
   )//from custom hook

//    fetch('http://localhost:3000/orders',{
//     method:'POST',
//     headers:{'content-type':'application/json'},
//   body:JSON.stringify({
//     order:{items:cartCtx.items,customer:customerData}
//   })
//    })//sending order data

 }
 let actions = (<>
 <Button type='button' textOnly onClick={handleCloseModal}>Close</Button>
                <Button>Submit Order</Button>
 </>)
 if(isSending){
    actions = <span>Sending Order data...</span>
 }
 if(data && !error){
    return <Modal open={userProgressCtx.progress==='checkout'}onClose={handleFinish}>
        <h2>Success !</h2>
        <p>Your order is submitted successfully</p>
        <p className="modal-actions">
            <Button onClick={handleFinish}>Okay</Button>      
        </p>

    </Modal>
 }
    return <Modal open={userProgressCtx.progress==='checkout'}onClose={handleCloseModal}>
        <form onSubmit={handleSubmit}>
            <h2>Checkout</h2>
            <p>Total Amount:{currencyFormatter.format(cartTotalPrice)} </p>
            <Input label="Full Name" type='text' id='name'/>
            <Input label='E-mail'id='email'type='email'/>
            <Input label='Street' type='text' id='street'/>
            <div className="control-row">
                <Input label='postal-code' type='text' id='postal-code'/>
                <Input label='City'  type='text' id='city'/>
            </div>
            {error && <Error title='failed to submit error'message={error}/>}
            <p className="modal-actions">
                {actions}
            </p>
        </form>
    </Modal>
}