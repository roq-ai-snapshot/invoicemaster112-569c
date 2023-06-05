import * as yup from 'yup';

export const userOrganisationValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  organisation_id: yup.string().nullable().required(),
});
