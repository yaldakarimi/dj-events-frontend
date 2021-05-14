import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { parseCookies } from '@/helpers/index';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '@/components/Layout';
import styles from '@/styles/Form.module.css';
import { API_URL } from '@/config/index';

export default function AddEventPage({ token }) {
  const router = useRouter();
  const [values, setValues] = useState({
    name: '', //this name is the event name and is different from the name attribute in inputs
    performers: '',
    venue: '',
    address: '',
    date: '',
    time: '',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Check if All inputs are filled in
    const hasEmptyFields = Object.values(values).some((item) => item === '');
    if (hasEmptyFields) {
      toast.error('Please fill all fields.');
    }

    const res = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error('No Token Included!');
        return;
      }
      toast.error('Something Went Wrong!');
    }

    const evt = await res.json();

    if (evt) {
      router.push(`/events/${evt.slug}`);
    }
  };

  return (
    <Layout title='Add New Event'>
      <h1>Add Event</h1>
      <ToastContainer />
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.grid}>
          <div>
            <label htmlFor='name'>Event Name</label>
            <input
              type='text'
              value={values.name}
              name='name'
              onChange={handleInputChange}
              id='name'
            />
          </div>

          <div>
            <label htmlFor='performers'>Performers</label>
            <input
              type='text'
              name='performers'
              value={values.performers}
              onChange={handleInputChange}
              id='performers'
            />
          </div>

          <div>
            <label htmlFor='venue'>Venue</label>
            <input
              type='text'
              name='venue'
              value={values.venue}
              onChange={handleInputChange}
              id='venue'
            />
          </div>

          <div>
            <label htmlFor='address'>Address</label>
            <input
              type='text'
              name='address'
              value={values.address}
              onChange={handleInputChange}
              id='address'
            />
          </div>

          <div>
            <label htmlFor='date'>Date</label>
            <input
              type='date'
              name='date'
              value={values.date}
              onChange={handleInputChange}
              id='date'
            />
          </div>

          <div>
            <label htmlFor='time'>Time</label>
            <input
              type='text'
              name='time'
              value={values.time}
              onChange={handleInputChange}
              id='time'
            />
          </div>
        </div>

        <label htmlFor='description'>Description</label>
        <textarea
          name='description'
          id='description'
          value={values.description}
          onChange={handleInputChange}
        />
        <input type='submit' value='Add Event' className='btn' />
      </form>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookies(req);

  return {
    props: {
      token,
    },
  };
}
