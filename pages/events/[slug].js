import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import styles from '@/styles/event.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { FaTimes, FaPencilAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function EventPage({ evt }) {
  const router = useRouter();

  const deleteEvent = async (e) => {
    if (confirm('Are you sure?')) {
      const res = await fetch(`${API_URL}/events/${evt.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
      } else {
        router.push('/events');
      }
    }
  };
  return (
    <Layout>
      <div className={styles.event}>
        <div className={styles.controls}>
          <Link href={`/events/edit/${evt.id}`}>
            <a>
              <FaPencilAlt />
              Edit Event
            </a>
          </Link>

          <a href='#' className={styles.delete} onClick={deleteEvent}>
            <FaTimes /> Delete Event
          </a>
        </div>

        <span>
          {new Date(evt.date).toLocaleDateString('en-US')} at {evt.time}
        </span>
        <h1>{evt.name}</h1>
        <ToastContainer />
        {evt.image && (
          <div className={styles.image}>
            <Image
              src={evt.image.formats.medium.url}
              width={960}
              height={600}
            />
          </div>
        )}

        <h3>Performers:</h3>
        <p>{evt.performers}</p>
        <h3>Description:</h3>
        <p>{evt.description}</p>
        <h3>Venue: {evt.venue}</h3>
        <p>{evt.address}</p>

        <Link href='/events'>
          <a className={styles.back}>{'<'} Go Back</a>
        </Link>
      </div>
    </Layout>
  );
}

// this methods should be used with each other to get each item statically and the way it does it is to create all paths at build time and then can go to event pages but these methods do not have access to context object so we cannot easily pass in the slug and we need to create the paths using the data (events) and then return an array of paths which have to have a params object and each param should have a slug

// paths : [{params:{slug : 'name of the slug'}, {slug : 'name of the slug'}, {slug : 'name of the slug'}, {slug : 'name of the slug'},}]

// and the way to create such array is to get all the data and map through it and then return an object with params and the slug for each event .... having a fallback is required

export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/events`);
  const events = await res.json();
  const paths = events.map((evt) => ({ params: { slug: evt.slug } }));
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const res = await fetch(`${API_URL}/events?slug=${slug}`);
  const eventArr = await res.json();

  return {
    // since evt in this case would be an array with only one object we should return the first item of the array so later we can access evt.id and stuff
    props: { evt: eventArr[0] },
    revalidate: 1,
  };
}

// Before strapi (just using next api routes)
// export async function getStaticProps({ params: { slug } }) {
//   const res = await fetch(`${API_URL}/api/events/${slug}`);
//   const eventArr = await res.json();

//   return {
//     // since evt in this case would be an array with only one object we should return the first item of the array so later we can access evt.id and stuff
//     props: { evt: eventArr[0] },
//     revalidate: 1,
//   };
// }

// using getServerSideProps generates the paths at each request and it has access to context which includes query and then query has access to slug so we can pass it in to our fetch url

// export async function getServerSideProps({ query: { slug } }) {
//   const res = await fetch(`${API_URL}/api/events/${slug}`);
//   const evt = await res.json();

//   return {
//     props: { evt },
//   };
// }
