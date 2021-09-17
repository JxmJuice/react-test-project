import React from "react";
import isEqual from "lodash/isEqual";
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import { cartProduct } from "../../constants";
import CartPopUp from "../CartPopUp/CartPopUp";
import ProductPage from "../ProductPage/ProductPage";
import Shop from "../Shop/Shop";
import "./Header.scss";
import Cart from "../Cart/Cart";
import Select from "../Select/Select";

class Header extends React.PureComponent {
  state = {
    cart: [] as cartProduct[],
    amount: 0,
    currency: { icon: "$", name: "USD" },
  };
  handleCurrency = (currency: string) => {
    switch (currency) {
      case "$ USD":
        this.setState({ currency: { icon: "$", name: "USD" } });
        break;
      case "£ GBP":
        this.setState({ currency: { icon: "£", name: "GBP" } });
        break;
      case "$ AUD":
        this.setState({ currency: { icon: "$", name: "AUD" } });
        break;
      case "¥ JPY":
        this.setState({ currency: { icon: "¥", name: "JPY" } });
        break;
      case "₽ RUB":
        this.setState({ currency: { icon: "₽", name: "RUB" } });
        break;
      default:
        break;
    }
  };

  addToCart = (product: cartProduct) => {
    const tempCart = this.state.cart;
    let isChanged = false;
    tempCart.map((el) => {
      let tempAmount = el.amount;
      el.amount = 1;
      if (isEqual(product, el)) {
        tempAmount++;
        el.amount = tempAmount;
        isChanged = true;
        return null;
      }
      el.amount = tempAmount;
      return null;
    });
    if (isChanged === false) {
      tempCart.push(product);
      this.setState({ cart: tempCart});
    }
    let amount = 0;
    tempCart.map((el) => {
      amount += el.amount;
      return null;
    });
    this.setState({ amount: amount });
  };

  handleAmount = (product: cartProduct) => {
    const tempCart = this.state.cart;
    tempCart.map((el, index) => {
      let temp = el.amount;
      el.amount = product.amount;
      if (isEqual(product, el)) {
        if (product.amount === 0) {
          this.setState({ amount: this.state.amount - 1 });
          tempCart.splice(index, 1);
          return null;
        }
        return null;
      }
      el.amount = temp;
      return null;
    });
    let amount = 0;
    tempCart.map((el) => {
      amount += el.amount;
      return null;
    });
    this.setState({ cart: tempCart, amount: amount });
  };

  handleCheckout = () => {
    this.setState({ cart: [], amount: 0 });
  };

  render() {
    return (
      <>
        <header className="Header">
          <div className="Header__wrapper">
            <nav className="Header__nav">
              <NavLink
                exact
                activeClassName="Header__link_active"
                to="/tech"
                className="Header__link Header__link_tech"
              >
                Tech
              </NavLink>
              <NavLink
                exact
                activeClassName="Header__link_active"
                to="/clothes"
                className="Header__link Header__link_clothes"
              >
                Clothes
              </NavLink>
              <NavLink
                exact
                activeClassName="Header__link_active"
                to="/all"
                className="Header__link Header__link_all"
              >
                All
              </NavLink>
            </nav>
            <img src="./logo.svg" alt="logo" />
            <div className="Header__shop-info">
              <Select handleCurrency={this.handleCurrency} />
              <CartPopUp
                cart={this.state.cart}
                amount={this.state.amount}
                handleAmount={this.handleAmount}
                handleCheckout={this.handleCheckout}
                currency={this.state.currency}
              />
            </div>
          </div>
        </header>
        <Switch>
          <Route path="/tech">
            <Shop category="tech" currency={this.state.currency} addToCart={this.addToCart}/>
          </Route>
          <Route path="/clothes">
            <Shop category="clothes" currency={this.state.currency} addToCart={this.addToCart} />
          </Route>
          <Route path="/all">
            <Shop category="" currency={this.state.currency} addToCart={this.addToCart}/>
          </Route>
          <Route path="/cart">
            <Cart
              cart={this.state.cart}
              handleAmount={this.handleAmount}
              handleCheckout={this.handleCheckout}
              currency={this.state.currency}
              amount={this.state.amount}
            />
          </Route>
          <Route path="/:id">
            <ProductPage
              addToCart={this.addToCart}
              currency={this.state.currency}
            />
          </Route>
          <Redirect exact path="/" to="/tech" />
        </Switch>
      </>
    );
  }
}

export default Header;
