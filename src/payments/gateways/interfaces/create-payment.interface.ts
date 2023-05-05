export interface ICreatePayment {
  amount: number;
  backurl: string;
  payload?: { [key: string]: any };
}

export interface ICreatePaymentReturn {
  paymentUrl: string;
  gatewayId: string;
}
