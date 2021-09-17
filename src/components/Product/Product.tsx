import { PureComponent } from "react";
import { cartProduct } from "../../constants";
import "./Product.scss";

const IMGSIZE = -141;

interface MyProps {
  product: cartProduct;
  handleAmount: (product: cartProduct) => void;
  updateTotal: (number: number) => void;
  currency: { icon: string; name: string };
  amount: number;
}

export default class CartProduct extends PureComponent<MyProps> {
  state = {
    amount: this.props.amount,
    counter: 0,
    price: 0,
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

  moveLeft = () => {
    this.setState({ counter: this.state.counter - 1 });
  };

  moveRight = () => {
    this.setState({ counter: this.state.counter + 1 });
  };

  preRender = () => {
    let style = undefined;
    if (this.state.amount === 0) {
      style = { display: "none" };
    } else {
      style = undefined;
    }
    let rightDisabled = "";
    let leftDisabled = "btn_disabled";
    if (this.state.counter === this.props.product.gallery.length - 1) {
      rightDisabled = "btn_disabled";
    } else {
      rightDisabled = "";
    }
    if (this.state.counter < 1) {
      leftDisabled = "btn_disabled";
    } else {
      leftDisabled = "";
    }
    return {
      style: style,
      rightDisabled: rightDisabled,
      leftDisabled: leftDisabled,
    };
  };

  renderAttributes = (attr: any, key: number) => {
    if (attr.name === "Color") {
      return (
        <div className="Product__attribute" key={key}>
          <div className="Product__attributes_name">{attr.name}</div>
          <div
            className="Product__attributes_attr"
            style={{ backgroundColor: attr.value }}
            key={key}
          ></div>
        </div>
      );
    } else {
      return (
        <div className="Product__attribute" key={key}>
          <div className="Product__attributes_name">{attr.name}</div>
          <div className="Product__attributes_attr" key={key}>
            {attr.value}
          </div>
        </div>
      );
    }
  };

  render() {
    const { style, rightDisabled, leftDisabled } = this.preRender();
    return (
      <div style={style} className="Product">
        <div className="Product__info">
          <div className="Product__info_brand">{this.props.product.brand}</div>
          <div className="Product__info_name">{this.props.product.name}</div>
          <div className="Product__info_price">
            {this.props.currency.icon}
            {this.state.price}
          </div>
          <div className="Product__attributes">
            {this.props.product.cartAttributes.map((attr, key) =>
              this.renderAttributes(attr, key)
            )}
          </div>
        </div>
        <div className="Product__amount">
          <button className="Product__amount_btn" onClick={this.handleInc}>
            +
          </button>
          <div className="Product__amount_number">{this.state.amount}</div>
          <button className="Product__amount_btn" onClick={this.handleDec}>
            -
          </button>
        </div>
        <div className="Product__images">
          <button
            className={`Product__btn Product__btn_left ${leftDisabled}`}
            onClick={this.moveLeft}
          >{`<`}</button>
          <div
            className="Product__images_wrapper"
            style={{
              transform: `translateX(${IMGSIZE * this.state.counter}px)`,
            }}
          >
            {this.props.product.gallery.map((el) => {
              return (
                <img
                  className="Product__image"
                  src={el}
                  alt={this.props.product.id}
                ></img>
              );
            })}
          </div>
          <button
            className={`Product__btn Product__btn_right ${rightDisabled}`}
            onClick={this.moveRight}
          >{`>`}</button>
        </div>
      </div>
    );
  }
}
