import { PureComponent } from "react";
import { cartProduct } from "../../constants";

interface MyProps {
  product: cartProduct;
  handleAmount: (product: cartProduct) => void;
  updateTotal: (number: number) => void;
  currency: { icon: string; name: string };
}

export default class CartProduct extends PureComponent<MyProps> {
  state = {
    amount: this.props.product.amount,
    price: 0,
  };

  handleInc = () => {
    let product = this.props.product;
    product.amount = this.state.amount + 1;
    this.setState({ amount: product.amount });
    this.props.handleAmount(product);
    this.props.updateTotal(+product.prices[0].amount.toFixed(2));
  };

  handleDec = () => {
    let product = this.props.product;
    product.amount = this.state.amount - 1;
    this.setState({ amount: product.amount });
    this.props.handleAmount(product);
    this.props.updateTotal(-product.prices[0].amount.toFixed(2));
    if (product.amount === 0) {
    }
  };

  componentDidMount() {
    this.handlePrice();
  }

  componentDidUpdate() {
    this.handlePrice();
    this.setState({ amount: this.props.product.amount });
  }

  handlePrice = () => {
    this.props.product.prices.map((price) => {
      if (price.currency === this.props.currency.name) {
        this.setState({ price: price.amount });
      }
      return null;
    });
  };

  renderAttributes = (attr: any, key: number) => {
    if (attr.name === "Color") {
      return (
        <div className="product__attribute" key={key}>
          <div className="product__attributes_name">{attr.name}</div>
          <div
            className="product__attributes_attr"
            style={{ backgroundColor: attr.value }}
            key={key}
          ></div>
        </div>
      );
    } else {
      return (
        <div className="product__attribute" key={key}>
          <div className="product__attributes_name">{attr.name}</div>
          <div className="product__attributes_attr">{attr.value}</div>
        </div>
      );
    }
  };

  render() {
    let currentState = '';
    if (this.state.amount === 0) {
      currentState = "hidden";
    } else {
      currentState = '';
    }
    return (
      <div className={`CartPopUp__product ${currentState}`}>
        <div className="CartPopUp__product_info">
          <div className="product__brand">{this.props.product.brand}</div>
          <div className="product__name">{this.props.product.name}</div>
          <div className="product__price">
            {this.props.currency.icon}
            {this.state.price}
          </div>
          <div className="product__attributes">
            {this.props.product.cartAttributes.map((attr, index) =>
              this.renderAttributes(attr, index)
            )}
          </div>
        </div>
        <div className="product__amount">
          <button className="product__amount_btn" onClick={this.handleInc}>
            +
          </button>
          <div className="product__amount_number">{this.state.amount}</div>
          <button className="product__amount_btn" onClick={this.handleDec}>
            -
          </button>
        </div>
        <img
          className="product__image"
          src={this.props.product.gallery[0]}
          alt={this.props.product.id}
        ></img>
      </div>
    );
  }
}
