import { PureComponent } from "react";
import "./Select.scss";

const query = `query GetCurrencies {
    currencies
  }`;

const TOP = -300;

const BOTTOM = 10;

interface MyProps {
  handleCurrency: (currency: string) => void;
}

export default class Select extends PureComponent<MyProps> {
  state = {
    currencies: [] as { icon: string; name: string }[],
    isChecked: true,
    currency: { icon: "$", name: "USD" } as { icon: string; name: string },
  };

  componentDidMount() {
    let currencies = [] as string[];
    fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        currencies = res.data.currencies;
        let result = [] as { icon: string; name: string }[];
        currencies.map((el) => {
          switch (el) {
            case "USD":
              result.push({ icon: "$", name: "USD" });
              break;
            case "GBP":
              result.push({ icon: "£", name: "GBP" });
              break;
            case "AUD":
              result.push({ icon: "$", name: "AUD" });
              break;
            case "JPY":
              result.push({ icon: "¥", name: "JPY" });
              break;
            case "RUB":
              result.push({ icon: "₽", name: "RUB" });
              break;
            default:
              break;
          }
          return null;
        });
        this.setState({ currencies: result });
      });
    
    const menu = document.querySelector(".Select__list");
    const btn = document.querySelector(".Select__button");

    document.addEventListener("click", (e) => {
      const target = e.target as Node;
      const isMenu = target === menu || (menu as HTMLElement).contains(target);
      const isBtn = target === btn;
      if (!isMenu && !isBtn) {
        console.log(1);
        this.setState({ isChecked: true });
      }
    });
  }

  handleClick = () => {
    if (this.state.isChecked === true) {
      this.setState({ isChecked: false });
    } else {
      this.setState({ isChecked: true });
    }
  };

  handleCurrency = (event: any) => {
    const currency = (event.target as HTMLElement).innerText;
    switch (currency) {
      case "$ USD":
        this.setState({ currency: { icon: "$", name: "USD" } });
        this.props.handleCurrency(`$ USD`);
        break;
      case "£ GBP":
        this.setState({ currency: { icon: "£", name: "GBP" } });
        this.props.handleCurrency(`£ GBP`);
        break;
      case "$ AUD":
        this.setState({ currency: { icon: "$", name: "AUD" } });
        this.props.handleCurrency(`$ AUD`);
        break;
      case "¥ JPY":
        this.setState({ currency: { icon: "¥", name: "JPY" } });
        this.props.handleCurrency(`¥ JPY`);
        break;
      case "₽ RUB":
        this.setState({ currency: { icon: "₽", name: "RUB" } });
        this.props.handleCurrency(`₽ RUB`);
        break;
      default:
        break;
    }
    this.handleClick();
  };

  render() {
    let translate;
    if (this.state.isChecked === true) {
      translate = TOP;
    } else {
      translate = BOTTOM;
    }
    return (
      <div className="Select">
        <button className="Select__button" onClick={this.handleClick}>
          {this.state.currency.icon} ˅
        </button>
        <ul
          className="Select__list"
          style={{ transform: `translateY(${translate}px)` }}
        >
          {this.state.currencies.map((el, index) => {
            return (
              <li key={index}>
                <button
                  className="Select__currency"
                  onClick={this.handleCurrency}
                >
                  {el.icon} {el.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
