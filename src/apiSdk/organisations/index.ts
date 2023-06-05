import axios from 'axios';
import queryString from 'query-string';
import { OrganisationInterface } from 'interfaces/organisation';
import { GetQueryInterface } from '../../interfaces';

export const getOrganisations = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/organisations${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createOrganisation = async (organisation: OrganisationInterface) => {
  const response = await axios.post('/api/organisations', organisation);
  return response.data;
};

export const updateOrganisationById = async (id: string, organisation: OrganisationInterface) => {
  const response = await axios.put(`/api/organisations/${id}`, organisation);
  return response.data;
};

export const getOrganisationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/organisations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteOrganisationById = async (id: string) => {
  const response = await axios.delete(`/api/organisations/${id}`);
  return response.data;
};
