// src/hooks/useForm.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      return response.data;
    },
  });
};
