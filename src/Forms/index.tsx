import { useForm, Controller } from 'react-hook-form';
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

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email().required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  country: yup.string().required('Country is required'),
  hobbies: yup.array().min(1, 'Select at least one hobby'),
  religion: yup.string().required('Religion is required'),
});

type FormData = yup.InferType<typeof schema>;


export default function UserForm() {
    const { data: countries,  } = useCountries();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
//   resolver: zodResolver(schema)  ,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-4">User Registration</h2>

      <div>
        <label>Name</label>
        <input {...register('name')} className="input" />
        <p className="text-red-500 text-sm">{errors.name?.message}</p>
      </div>

      <div>
        <label>Email</label>
        <input {...register('email')} type="email" className="input" />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
      </div>

      <div>
        <label>Phone</label>
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <PhoneInput country={'us'} {...field} inputClass="!w-full !p-2" />
          )}
        />
        <p className="text-red-500 text-sm">{errors.phone?.message}</p>
      </div>

      <div>
        <label>Country</label>
        <select {...register('country')} className="input">
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
        <label>Hobbies</label>
        <div className="flex gap-4 flex-wrap">
          {['Reading', 'Music', 'Sports', 'Coding'].map((hobby) => (
            <label key={hobby} className="flex items-center gap-2">
              <input type="checkbox" value={hobby} {...register('hobbies')} />
              {hobby}
            </label>
          ))}
        </div>
        <p className="text-red-500 text-sm">{errors.hobbies?.message}</p>
      </div>

      <div>
        <label>Religion</label>
        <div className="flex gap-4">
          {['Christianity', 'Islam', 'Hinduism', 'Other'].map((r) => (
            <label key={r} className="flex items-center gap-2">
              <input type="radio" value={r} {...register('religion')} />
              {r}
            </label>
          ))}
        </div>
        <p className="text-red-500 text-sm">{errors.religion?.message}</p>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
