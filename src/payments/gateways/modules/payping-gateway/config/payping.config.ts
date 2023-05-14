import { registerAs } from '@nestjs/config';

export default registerAs('payping', () => {
  return {
    PAYPING_TOKEN: process.env.PAYPING_TOKEN,
  };
});
