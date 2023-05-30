export interface IPaypingCreatepaymentResponse {
  code: string;
}

export interface IPaypingVerifyPaymentBody {
  code?: string;
  refid?: string;
}
