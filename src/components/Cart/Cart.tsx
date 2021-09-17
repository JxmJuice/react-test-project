import { PureComponent } from "react";
import { cartProduct } from "../../constants";
import Product from "../Product/Product";
import "./Cart.scss";

interface MyProps {
  cart: cartProduct[];
  amount: number;
  handleAmount: (product: cartProduct) => void;
  handleCheckout: () => void;
  currency: { icon: string; name: string };
}

export default class Cart extends PureComponent<MyProps> {
  componentDidUpdate() {
    console.log('updated')
    const total = this.handlePrice();
    this.setState({ total: +total.toFixed(2) });
  }

  componentDidMount() {
    const total =this.handlePrice();
    this.setState({ total: +total.toFixed(2) });
  }

  state = {
    total: 0,
    cart: this.props.cart
  };

  handlePrice = () => {
    let total = 0;
    this.props.cart.map((product) => {
      product.prices.map((price) => {
        if (price.currency === this.props.currency.name) {
          total += price.amount * product.amount;
        }
        return null;
      });
      return null;
    });
    return total;
  };

  updateTotal = (number: number) => {
    const newTotal = +(this.state.total + number).toFixed(2);
    this.setState({ total: newTotal });
  };

  render() {
    return (
      <div className="Cart__wrapper">
        <div className="Cart__title">Cart</div>
        <div className="Cart__products">
          {this.state.cart.map((el, index) => {
            return (
              <Product
                product={el}
                key={index}
                handleAmount={this.props.handleAmount}
                updateTotal={this.updateTotal}
                currency={this.props.currency}
                amount={el.amount}
              />
            );
          })}
        </div>
        <div className="Cart__control">
          <div className="Cart__total">
            <div className="Cart__total_title">Total:</div>
            <div className="Cart__total_price">
              {this.props.currency.icon}
              {this.state.total}
            </div>
          </div>
          <button
            className="Cart__checkout"
            onClick={this.props.handleCheckout}
          >
            check out
          </button>
        </div>
      </div>
    );
  }
}
