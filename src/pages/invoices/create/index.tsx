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
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createInvoice } from 'apiSdk/invoices';
import { Error } from 'components/error';
import { invoiceValidationSchema } from 'validationSchema/invoices';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganisationInterface } from 'interfaces/organisation';
import { getOrganisations } from 'apiSdk/organisations';
import { InvoiceInterface } from 'interfaces/invoice';

function InvoiceCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: InvoiceInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createInvoice(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<InvoiceInterface>({
    initialValues: {
      client_name: '',
      client_email: '',
      invoice_number: '',
      due_date: new Date(new Date().toDateString()),
      status: '',
      organisation_id: (router.query.organisation_id as string) ?? null,
      payment: [],
    },
    validationSchema: invoiceValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Invoice
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="client_name" mb="4" isInvalid={!!formik.errors?.client_name}>
            <FormLabel>client_name</FormLabel>
            <Input type="text" name="client_name" value={formik.values?.client_name} onChange={formik.handleChange} />
            {formik.errors.client_name && <FormErrorMessage>{formik.errors?.client_name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="client_email" mb="4" isInvalid={!!formik.errors?.client_email}>
            <FormLabel>client_email</FormLabel>
            <Input type="text" name="client_email" value={formik.values?.client_email} onChange={formik.handleChange} />
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'invoice',
  operation: AccessOperationEnum.CREATE,
})(InvoiceCreatePage);
