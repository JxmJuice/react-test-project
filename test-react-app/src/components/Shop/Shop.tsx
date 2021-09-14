import { PureComponent } from "react";
import { Route } from "react-router";
import { product } from "../../constants";
import ProductCard from "../ProductCard/ProductCard";
import ProductPage from "../ProductPage/ProductPage";
import "./Shop.scss";

interface MyProps {
  category: string;
  currency:{ icon: string, name: string }
}

var query = `query GetCategory($input: CategoryInput) {
    category(input:$input) {
        products {
            id,
            name,
            inStock,
            gallery,
            description,
            category,
            prices{
                currency
                amount
            },
            brand
        }
    }
  }`;

export default class Shop extends PureComponent<MyProps> {
  state = {
    products: [],
    title: "",
    category: this.props.category,
  };

  componentDidMount() {
    this.handleUpdate();
  }

  componentDidUpdate() {
    if (this.props.category !== this.state.category) {
      this.handleUpdate();
    }
  }

  handleUpdate = () => {
    this.setState({ category: this.props.category });
    fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { input: { title: this.props.category } },
      }),
    })
      .then((r) => r.json())
      .then(async (res) => {
        console.log(res);
        if (res.data.category !== undefined) {
          await this.setState({ products: res.data.category.products });
          console.log(res);
        }
      });

    switch (this.props.category) {
      case "":
        this.setState({ title: "All" });
        break;
      case "clothes":
        this.setState({ title: "Clothes" });
        break;
      case "tech":
        this.setState({ title: "Tech" });
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div className="Shop">
        <div className="Shop__wrapper">
          <h2 className="Shop__category">{this.state.title}</h2>
          <div className="Shop__products">
            {this.state.products.map((el: product, index) => {
              return <ProductCard key={index} product={el} currency={this.props.currency}/>;
            })}
          </div>
        </div>
      </div>
    );
  }
}
