import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getContractById } from 'apiSdk/contracts';
import { Error } from 'components/error';
import { ContractInterface } from 'interfaces/contract';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function ContractViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ContractInterface>(
    () => (id ? `/contracts/${id}` : null),
    () =>
      getContractById(id, {
        relations: ['organisation'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Contract Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              client_name: {data?.client_name}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              client_email: {data?.client_email}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              contract_number: {data?.contract_number}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              start_date: {data?.start_date as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              end_date: {data?.end_date as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              status: {data?.status}
            </Text>
            {hasAccess('organisation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                organisation:{' '}
                <Link href={`/organisations/view/${data?.organisation?.id}`}>{data?.organisation?.name}</Link>
              </Text>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'contract',
  operation: AccessOperationEnum.READ,
})(ContractViewPage);
