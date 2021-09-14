export interface product {
  name: string;
  id: string;
  inStock: boolean;
  gallery: [string];
  description: string;
  category: string;
  attributes: [
    {
      id: string;
      name: string;
      type: string;
      items: [
        {
          displayValue: string;
          value: string;
          id: string;
        }
      ];
    }
  ];
  prices: [
    {
      currency: string;
      amount: number;
    }
  ];
  brand: string;
}

export interface cartProduct extends product {
  cartAttributes: { name: string; value: string }[];
  amount: number;
}

