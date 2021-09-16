import { PureComponent } from "react";
import { Link } from "react-router-dom";
import { cartProduct } from "../../constants";
import CartProduct from "../CartProduct/CartProduct";
import "./CartPopUp.scss";

interface MyProps {
  cart: cartProduct[];
  amount: number;
  handleAmount: (product: cartProduct) => void;
  handleCheckout: () => void;
  currency: { icon: string; name: string };
}

export default class CartPopUp extends PureComponent<MyProps> {
  componentDidUpdate() {
    const total = this.handlePrice();
    this.setState({ total: +total.toFixed(2) });
  }

  componentDidMount() {
    this.handlePrice();
  }

  handlePrice = () => {
    let total = 0;
    this.props.cart.map((product) => {
      product.prices.map((price) => {
        if (price.currency === this.props.currency.name) {
          total += price.amount*product.amount;
        }
      });
    });
    return total;
  };

  state = {
    isChecked: false,
    total: 0,
  };

  updateTotal = (number: number) => {
    const newTotal = +(this.state.total + number).toFixed(2);
    this.setState({ total: newTotal });
  };

  handlePopUp = () => {
    if (this.state.isChecked === true) {
      this.setState({ isChecked: false });
    } else {
      this.setState({ isChecked: true });
    }
  };

  render() {
    let amountComponent = null;
    let itemString = "item";
    if (this.props.amount != 1) {
      itemString += "s";
    }
    if (this.props.amount !== 0) {
      amountComponent = (
        <div className="CartPopUp__amount">{this.props.amount}</div>
      );
    } else {
      amountComponent = null;
    }
    let popUp = null;
    let plug = null;
    if (this.state.isChecked == true) {
      document.body.style.overflowY = "hidden";
      plug = <div className="CartPopUp__plug" onClick={this.handlePopUp}></div>;
      popUp = (
        <>
          <div className="CartPopUp__wrapper">
            <div className="CartPopUp__number">
              <strong>My bag,</strong> {this.props.amount} {itemString}
            </div>
            <div className="CartPopUp__products">
              {this.props.cart.map((el, index) => {
                return (
                  <CartProduct
                    product={el}
                    key={index}
                    handleAmount={this.props.handleAmount}
                    updateTotal={this.updateTotal}
                    currency={this.props.currency}
                  />
                );
              })}
            </div>
            <div className="CartPopUp__total">
              <div className="CartPopUp__total_title">Total</div>
              <div className="CartPopUp__total_price">{this.props.currency.icon}{this.state.total}</div>
            </div>
            <div className="CartPopUp__btns">
              <Link
                to="/cart"
                className="CartPopUp__btns_cart"
                onClick={this.handlePopUp}
              >
                view bag
              </Link>
              <button
                className="CartPopUp__btns_checkout"
                onClick={this.props.handleCheckout}
              >
                check out
              </button>
            </div>
          </div>
        </>
      );
    } else {
      document.body.style.overflowY = "scroll";
      popUp = null;
      plug = null;
    }
    return (
      <>
        {plug}
        <div className="CartPopUp">
          <label>
            <input
              type="checkbox"
              style={{ width: "0", height: "1px", margin: "-1px" }}
              onChange={this.handlePopUp}
            ></input>
            {amountComponent}
            <div className="CartPopUp__image"></div>
          </label>
          {popUp}
        </div>
      </>
    );
  }
}
