import { ChangeEvent, PureComponent } from "react";
import { cartProduct, product } from "../../constants";
import parse from "html-react-parser";
import "./ProductPage.scss";
import { RouteComponentProps, withRouter } from "react-router";

interface MyProps {
  addToCart: (product: cartProduct) => void;
  currency: { icon: string; name: string };
}

const query = `query GetProduct($id: String!) {
    product(id:$id) {
            id,
            name,
            inStock,
            gallery,
            description,
            category,
            attributes{
                id,
                name,
                type,
                items {
                    displayValue,
                    value,
                    id
                }
            },
            prices{
                currency
                amount
            },
            brand
    }
  }`;

class ProductPage extends PureComponent<MyProps & RouteComponentProps> {
  state = {
    img: "",
    selectedAttributes: [] as { name: string; value: string }[],
    amount: 0,
    id: this.props.location.pathname,
    product: {
      name: "",
      id: "",
      inStock: false,
      gallery: [""],
      description: "",
      category: "",
      attributes: [
        {
          name: "",
          id: "",
          type: "",
          items: [
            {
              displayValue: "",
              value: "",
              id: "",
            },
          ],
        },
      ],
      prices: [
        {
          currency: "",
          amount: 0,
        },
      ],
      brand: "",
    } as product,
  };

  componentDidMount() {
    this.handleUpdate();
    this.handleAmount();
  }

  componentDidUpdate() {
    this.handleAmount();
  }

  handleAmount = () => {
    this.state.product.prices.map((price) => {
      if (price.currency === this.props.currency.name) {
        this.setState({ amount: price.amount });
      }
    });
  };

  handleUpdate = () => {
    const location = this.props.location.pathname.split("/");
    const path = location[location.length - 1];
    this.setState({ id: path });
    fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { id: path },
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.data.product !== undefined) {
          this.setState({ product: res.data.product });
          this.setState({ img: res.data.product.gallery[0] });
        }
      });
  };

  handleImage = (event: any) => {
    const src = (event?.target as HTMLImageElement).src;
    this.setState({ img: src });
  };

  handleAddToCart = () => {
    const product = {
      ...this.state.product,
      cartAttributes: [] as { name: string; value: string }[],
      amount: 1,
    };
    this.state.selectedAttributes.map((attr) => {
      product.cartAttributes.push({ name: attr.name, value: attr.value });
    });
    if (
      product.cartAttributes.length !== this.state.product.attributes.length
    ) {
      return;
    }
    this.props.addToCart(product);
  };

  handleChange = async (event: ChangeEvent) => {
    const picker = event.target as HTMLInputElement;
    const title = picker
      .closest(".attribute")
      ?.querySelector(".attribute__title")?.innerHTML as string;
    const temp = this.state.selectedAttributes.filter(
      (attr) => attr.name !== title
    );
    await this.setState({ selectedAttributes: temp });
    picker
      .closest(".attribute__picker")
      ?.querySelectorAll(".selected")
      .forEach((el) => {
        if (el !== picker.nextSibling) {
          el.classList.remove("selected");
        }
      });
    picker.nextElementSibling?.classList.toggle("selected");
    if (picker.nextElementSibling?.classList.contains("selected")) {
      const cartAttr = this.state.selectedAttributes;
      cartAttr.push({
        name: title,
        value: (event.target.nextElementSibling as HTMLElement).dataset
          ?.value as string,
      });
      this.setState({ selectedAttributes: cartAttr });
    }
  };

  render() {
    let attributes = [] as any;
    if (this.state.product.attributes !== undefined) {
      this.state.product.attributes.map((attr, key) => {
        if (attr.name === "Color") {
          attributes.push(
            <>
              <div className="attribute" key={key}>
                <div className="attribute__title">{attr.name}</div>
                <div className="attribute__picker">
                  {attr.items.map((el, index) => {
                    return (
                      <label key={index}>
                        <input
                          type="checkbox"
                          onChange={this.handleChange}
                          style={{
                            width: "0",
                            height: "1px",
                            margin: "-1px",
                          }}
                        />
                        <div
                          className="attribute__picker_btn"
                          style={{ backgroundColor: el.value }}
                          data-value={el.value}
                        ></div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </>
          );
        } else {
          attributes.push(
            <div className="attribute" key={key}>
              <div className="attribute__title">{attr.name}</div>
              <div className="attribute__picker">
                {attr.items.map((el, index) => {
                  return (
                    <label key={index}>
                      <input
                        type="checkbox"
                        onChange={this.handleChange}
                        style={{
                          width: "0",
                          height: "1px",
                          margin: "-1px",
                        }}
                      />
                      <div
                        className="attribute__picker_btn"
                        data-value={el.value}
                      >
                        {el.value}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        }
      });
    }
    return (
      <div className="ProductPage">
        <div className="ProductPage__wrapper">
          <div className="ProductPage__gallery">
            {this.state.product.gallery.map((img, index) => {
              return (
                <img
                  className="ProductPage__gallery_image"
                  src={img}
                  alt=""
                  key={index}
                  onClick={this.handleImage}
                />
              );
            })}
          </div>
          <img
            className="ProductPage__main-image"
            src={this.state.img}
            alt={this.state.product.id}
          />
          <div className="ProductPage__info">
            <div className="ProductPage__info_brand">
              {this.state.product.brand}
            </div>
            <div className="ProductPage__info_name">
              {this.state.product.name}
            </div>
            <div className="ProductPage__info_attributes">{attributes}</div>
            <div className="ProductPage__info_price">
              <div className="price__title">Price:</div>
              <div className="price__value">
                {this.props.currency.icon}
                {this.state.amount}
              </div>
            </div>
            <button
              className="ProductPage__info_cart-btn"
              onClick={this.handleAddToCart}
            >
              add to cart
            </button>
            <div className="ProductPage__info_description">
              {parse(this.state.product.description)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProductPage);
