import { ToastContainer, toast } from 'react-toastify';
import { FaImage } from 'react-icons/fa';
import moment from 'moment';
import Image from 'next/image';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';
import ImageUpload from '@/components/ImageUpload';
import styles from '@/styles/Form.module.css';
import { API_URL } from '@/config/index';

export default function AddEventPage({ evt }) {
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState(
    evt.image ? evt.image.formats.thumbnail.url : null
  );

  const [showModal, setShowModal] = useState(false);

  const [values, setValues] = useState({
    name: evt.name,
    performers: evt.performers,
    venue: evt.venue,
    address: evt.address,
    date: evt.date,
    time: evt.time,
    description: evt.description,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const imageUploaded = async () => {
    const res = await fetch(`${API_URL}/events/${evt.id}`);
    const data = await res.json();
    setImagePreview(data.image.formats.thumbnail.url);
    setShowModal(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const hasEmptyFields = Object.values(values).some((item) => item === '');

    if (hasEmptyFields) {
      toast.error('Please fill in all fields');
    }

    const res = await fetch(`${API_URL}/events/${evt.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(values),
    });

    if (!res.ok) {
      toast.error('Something Went Wrong');
    } else {
      const evt = await res.json();
      router.push(`/events/${evt.slug}`);
    }
  };

  return (
    <Layout title='Add New Event'>
      <h1>Edit Event</h1>
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
              value={moment(values.date).format('yyyy-MM-DD')}
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
        <input type='submit' value='Update Event' className='btn' />
      </form>
      <h2>Event Image</h2>
      {imagePreview ? (
        <Image src={imagePreview} height={100} width={170} />
      ) : (
        <div>
          <p>No image uploaded</p>
        </div>
      )}
      <div>
        <button className='btn-secondary' onClick={() => setShowModal(true)}>
          <FaImage /> Set an image
        </button>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload evtId={evt.id} imageUploaded={imageUploaded} />
      </Modal>
    </Layout>
  );
}

export async function getServerSideProps({ params: { id } }) {
  const res = await fetch(`${API_URL}/events/${id}`);
  const evt = await res.json();

  return {
    props: {
      evt,
    },
  };
}
