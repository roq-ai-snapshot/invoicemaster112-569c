import { OrganisationInterface } from 'interfaces/organisation';

export interface ContractInterface {
  id?: string;
  organisation_id: string;
  client_name: string;
  client_email: string;
  contract_number: string;
  start_date: Date;
  end_date: Date;
  status: string;

  organisation?: OrganisationInterface;
  _count?: {};
}
