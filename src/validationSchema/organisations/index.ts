import * as yup from 'yup';
import { contractValidationSchema } from 'validationSchema/contracts';
import { invoiceValidationSchema } from 'validationSchema/invoices';
import { userOrganisationValidationSchema } from 'validationSchema/user-organisations';

export const organisationValidationSchema = yup.object().shape({
  name: yup.string().required(),
  owner_id: yup.string().nullable().required(),
  contract: yup.array().of(contractValidationSchema),
  invoice: yup.array().of(invoiceValidationSchema),
  user_organisation: yup.array().of(userOrganisationValidationSchema),
});
