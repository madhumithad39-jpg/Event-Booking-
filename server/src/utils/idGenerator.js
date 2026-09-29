import crypto from 'crypto';

export const generateBookingId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // excluding confusing 0, O, 1, I
  let randomStr = '';
  const randomBytes = crypto.randomBytes(8);
  for (let i = 0; i < 8; i++) {
    randomStr += chars[randomBytes[i] % chars.length];
  }
  return `EVT-${randomStr}`;
};

export default {
  generateBookingId,
};
