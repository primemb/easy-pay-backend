export interface ICreatePayment {
  amount: number;
  payload?: { [key: string]: any };
}

export interface ICreatePaymentReturn {
  paymentUrl: string;
  gatewayId: string;
}
