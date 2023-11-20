import Checkout from "./UI/Checkout.jsx";
import Cart from "./componants/Cart.jsx";
import Header from "./componants/Header";
import Meals from "./componants/Meals";
import { CartContextProvider } from './store/CartContext.jsx'
import { UserProgressContextProvider } from "./store/UserProgressContext.jsx";

function App() {
  return (
    <CartContextProvider>
      <UserProgressContextProvider>
      <Header/>
      <Meals/>
      <Cart/>
      <Checkout/>

      </UserProgressContextProvider>
      
    </CartContextProvider>
  );
}

export default App;
