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
import { createContract } from 'apiSdk/contracts';
import { Error } from 'components/error';
import { contractValidationSchema } from 'validationSchema/contracts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganisationInterface } from 'interfaces/organisation';
import { getOrganisations } from 'apiSdk/organisations';
import { ContractInterface } from 'interfaces/contract';

function ContractCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ContractInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createContract(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ContractInterface>({
    initialValues: {
      client_name: '',
      client_email: '',
      contract_number: '',
      start_date: new Date(new Date().toDateString()),
      end_date: new Date(new Date().toDateString()),
      status: '',
      organisation_id: (router.query.organisation_id as string) ?? null,
    },
    validationSchema: contractValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Contract
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
          <FormControl id="contract_number" mb="4" isInvalid={!!formik.errors?.contract_number}>
            <FormLabel>contract_number</FormLabel>
            <Input
              type="text"
              name="contract_number"
              value={formik.values?.contract_number}
              onChange={formik.handleChange}
            />
            {formik.errors.contract_number && <FormErrorMessage>{formik.errors?.contract_number}</FormErrorMessage>}
          </FormControl>
          <FormControl id="start_date" mb="4">
            <FormLabel>start_date</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.start_date}
              onChange={(value: Date) => formik.setFieldValue('start_date', value)}
            />
          </FormControl>
          <FormControl id="end_date" mb="4">
            <FormLabel>end_date</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.end_date}
              onChange={(value: Date) => formik.setFieldValue('end_date', value)}
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
  entity: 'contract',
  operation: AccessOperationEnum.CREATE,
})(ContractCreatePage);
