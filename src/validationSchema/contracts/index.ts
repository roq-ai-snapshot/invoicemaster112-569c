import * as yup from 'yup';

export const contractValidationSchema = yup.object().shape({
  client_name: yup.string().required(),
  client_email: yup.string().required(),
  contract_number: yup.string().required(),
  start_date: yup.date().required(),
  end_date: yup.date().required(),
  status: yup.string().required(),
  organisation_id: yup.string().nullable().required(),
});
