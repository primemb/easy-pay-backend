import { registerAs } from '@nestjs/config';

export default registerAs('zarinpal', () => {
  return {
    ZARINPAL_MERCHENT_ID: process.env.ZARINPAL_MERCHENT_ID,
  };
});
