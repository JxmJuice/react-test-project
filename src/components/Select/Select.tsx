import { PureComponent } from "react";
import "./Select.scss";

const query = `query GetCurrencies {
    currencies
  }`;

  interface MyProps {
      handleCurrency:(currency: string)=>void
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
        });
        this.setState({ currencies: result });
      });
  }

  handleClick = () => {
    this.setState({ isChecked: !this.state.isChecked });
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
      translate = -300;
    } else {
      translate = 10;
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
          {this.state.currencies.map((el) => {
            return (
              <li>
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
