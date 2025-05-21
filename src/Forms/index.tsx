import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { api } from '../lib/axios';
import { useCountries } from '../hooks/useForm';

interface Country {
  name: { common: string };
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  country: yup.string().required('Country is required'),
  hobbies: yup.array().of(yup.string()).min(1, 'Select at least one hobby').required(),
  religion: yup.string().required('Religion is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function UserForm() {
  const { data: countries } = useCountries();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/users', data),
    onSuccess: () => {
      toast.success('Form submitted successfully!');
      reset();
    },
    onError: () => {
      toast.error('Submission failed!');
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const inputClass =
    'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600';

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl bg-white shadow-lg p-8 rounded-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-green-700">User Registration</h2>

        <div>
          <label className="block font-medium mb-1">Name</label>
          <input {...register('name')} className={inputClass} />
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input type="email" {...register('email')} className={inputClass} />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>

        <div>
          <label className="block font-medium mb-1">Phone</label>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                country={'ng'}
                value={value}
                onChange={onChange}
                inputClass="!w-full !p-2 !border !border-gray-300 !rounded-md focus:!outline-none focus:!ring-2 focus:!ring-green-600"
              />
            )}
          />
          <p className="text-red-500 text-sm">{errors.phone?.message}</p>
        </div>

        <div>
          <label className="block font-medium mb-1">Country</label>
          <select {...register('country')} className={inputClass}>
            <option value="">Select a country</option>
            {countries?.map((c: Country) => (
              <option key={c.name.common} value={c.name.common}>
                {c.name.common}
              </option>
            ))}
          </select>
          <p className="text-red-500 text-sm">{errors.country?.message}</p>
        </div>

        <div>
          <label className="block font-medium mb-1">Hobbies</label>
          <div className="flex flex-wrap gap-4">
            {['Reading', 'Music', 'Sports', 'Coding'].map((hobby) => (
              <label key={hobby} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={hobby}
                  {...register('hobbies')}
                  className="accent-green-600"
                />
                {hobby}
              </label>
            ))}
          </div>
          <p className="text-red-500 text-sm">{errors.hobbies?.message}</p>
        </div>

        <div>
          <label className="block font-medium mb-1">Religion</label>
          <div className="flex flex-wrap gap-4">
            {['Christianity', 'Islam', 'Hinduism', 'Other'].map((r) => (
              <label key={r} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={r}
                  {...register('religion')}
                  className="accent-green-600"
                />
                {r}
              </label>
            ))}
          </div>
          <p className="text-red-500 text-sm">{errors.religion?.message}</p>
        </div>

        <button
          type="submit"
          disabled={!isValid || mutation.status === 'pending'}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50 w-full"
        >
          {mutation.status === 'pending' ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
