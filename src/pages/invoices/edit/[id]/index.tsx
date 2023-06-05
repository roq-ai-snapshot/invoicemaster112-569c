import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getInvoiceById, updateInvoiceById } from 'apiSdk/invoices';
import { Error } from 'components/error';
import { invoiceValidationSchema } from 'validationSchema/invoices';
import { InvoiceInterface } from 'interfaces/invoice';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganisationInterface } from 'interfaces/organisation';
import { getOrganisations } from 'apiSdk/organisations';
import { paymentValidationSchema } from 'validationSchema/payments';

function InvoiceEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<InvoiceInterface>(
    () => (id ? `/invoices/${id}` : null),
    () => getInvoiceById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: InvoiceInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateInvoiceById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<InvoiceInterface>({
    initialValues: data,
    validationSchema: invoiceValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Invoice
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="client_name" mb="4" isInvalid={!!formik.errors?.client_name}>
              <FormLabel>client_name</FormLabel>
              <Input type="text" name="client_name" value={formik.values?.client_name} onChange={formik.handleChange} />
              {formik.errors.client_name && <FormErrorMessage>{formik.errors?.client_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="client_email" mb="4" isInvalid={!!formik.errors?.client_email}>
              <FormLabel>client_email</FormLabel>
              <Input
                type="text"
                name="client_email"
                value={formik.values?.client_email}
                onChange={formik.handleChange}
              />
              {formik.errors.client_email && <FormErrorMessage>{formik.errors?.client_email}</FormErrorMessage>}
            </FormControl>
            <FormControl id="invoice_number" mb="4" isInvalid={!!formik.errors?.invoice_number}>
              <FormLabel>invoice_number</FormLabel>
              <Input
                type="text"
                name="invoice_number"
                value={formik.values?.invoice_number}
                onChange={formik.handleChange}
              />
              {formik.errors.invoice_number && <FormErrorMessage>{formik.errors?.invoice_number}</FormErrorMessage>}
            </FormControl>
            <FormControl id="due_date" mb="4">
              <FormLabel>due_date</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.due_date}
                onChange={(value: Date) => formik.setFieldValue('due_date', value)}
              />
            </FormControl>
            <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
              <FormLabel>status</FormLabel>
              <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
              {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<OrganisationInterface>
              formik={formik}
              name={'organisation_id'}
              label={'organisation_id'}
              placeholder={'Select Organisation'}
              fetcher={getOrganisations}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'invoice',
  operation: AccessOperationEnum.UPDATE,
})(InvoiceEditPage);
