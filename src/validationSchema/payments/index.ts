import * as yup from 'yup';

export const paymentValidationSchema = yup.object().shape({
  amount: yup.number().integer().required(),
  payment_date: yup.date().required(),
  payment_method: yup.string().required(),
  invoice_id: yup.string().nullable().required(),
});
