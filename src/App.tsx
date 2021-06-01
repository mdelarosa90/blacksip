import "./App.scss";
import AdressContainer from "./components/address-container";
import OrderResume from "./components/order-resume";

function App() {
  return (
    <div className="container">
      <div className="main-content">
        <AdressContainer />
        <OrderResume />
      </div>
    </div>
  );
}

export default App;
