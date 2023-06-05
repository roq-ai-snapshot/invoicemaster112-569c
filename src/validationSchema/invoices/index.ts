import * as yup from 'yup';
import { paymentValidationSchema } from 'validationSchema/payments';

export const invoiceValidationSchema = yup.object().shape({
  client_name: yup.string().required(),
  client_email: yup.string().required(),
  invoice_number: yup.string().required(),
  due_date: yup.date().required(),
  status: yup.string().required(),
  organisation_id: yup.string().nullable().required(),
  payment: yup.array().of(paymentValidationSchema),
});
