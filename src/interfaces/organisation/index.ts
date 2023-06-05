import { ContractInterface } from 'interfaces/contract';
import { InvoiceInterface } from 'interfaces/invoice';
import { UserOrganisationInterface } from 'interfaces/user-organisation';
import { UserInterface } from 'interfaces/user';

export interface OrganisationInterface {
  id?: string;
  name: string;
  owner_id: string;
  contract?: ContractInterface[];
  invoice?: InvoiceInterface[];
  user_organisation?: UserOrganisationInterface[];
  user?: UserInterface;
  _count?: {
    contract?: number;
    invoice?: number;
    user_organisation?: number;
  };
}
