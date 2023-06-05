import axios from 'axios';
import queryString from 'query-string';
import { UserOrganisationInterface } from 'interfaces/user-organisation';
import { GetQueryInterface } from '../../interfaces';

export const getUserOrganisations = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/user-organisations${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createUserOrganisation = async (userOrganisation: UserOrganisationInterface) => {
  const response = await axios.post('/api/user-organisations', userOrganisation);
  return response.data;
};

export const updateUserOrganisationById = async (id: string, userOrganisation: UserOrganisationInterface) => {
  const response = await axios.put(`/api/user-organisations/${id}`, userOrganisation);
  return response.data;
};

export const getUserOrganisationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/user-organisations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteUserOrganisationById = async (id: string) => {
  const response = await axios.delete(`/api/user-organisations/${id}`);
  return response.data;
};
