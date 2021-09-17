import { PureComponent } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { cartProduct, product } from "../../constants";
import "./ProductCard.scss";

interface MyProps {
  product: product;
  currency: { icon: string; name: string };
  addToCart:(product:cartProduct)=>void
}

class ProductCard extends PureComponent<MyProps & RouteComponentProps> {
  state = { amount: 0 };

  componentDidMount() {
    this.handleAmount();
  }

  componentDidUpdate() {
    this.handleAmount();
  }

  handleAmount = () => {
    this.props.product.prices.map((price) => {
      console.log("current", price.currency, this.props.currency.name);
      if (price.currency === this.props.currency.name) {
        this.setState({ amount: price.amount });
      }
      return null;
    });
  };

  addToCart = (event: any) => {
    event.stopPropagation();
    const product = {
      ...this.props.product,
      cartAttributes: [] as { name: string; value: string }[],
      amount: 1,
    };
    this.props.product.attributes.map((attr) => {
      product.cartAttributes.push({ name: attr.name, value: attr.items[0].value });
      return null;
    });
    if (
      product.cartAttributes.length !== this.props.product.attributes.length
    ) {
      return;
    }
    this.props.addToCart(product);
  };

  render() {
    let inStock;
    if (this.props.product.inStock === false) {
      inStock = <div className="out-of-stock">out of stock</div>;
    } else {
      inStock = null;
    }
    return (
      <div className="ProductCard" onClick={() => this.props.history.push(`/${this.props.product.id}`)}>
        <img
          src={this.props.product.gallery[0]}
          className="ProductCard__image"
          alt={this.props.product.name}
        />
        <div className="ProductCard__name">{`${this.props.product.brand} ${this.props.product.name}`}</div>
        <div className="ProductCard__price">{`${this.props.currency.icon}${this.state.amount}`}</div>
        <div
          className="ProductCard__buy-btn"
          onClick={this.addToCart}
        ></div>
        {inStock}
      </div>
    );
  }
}
export default withRouter(ProductCard);
