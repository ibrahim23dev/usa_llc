export type IEncodedPaymentData = {
  userId: string;
  course_id: string;
  userName?: string;
  email: string;
  phone: string;
  amount: {
    currency: string;
    total: string;
  };
};
