import cookie from 'cookie';
import { API_URL } from '@/config/index';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { identifier, password } = req.body;

    const strapiRes = await fetch(`${API_URL}/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ identifier, password }),
    });

    const data = await strapiRes.json();

    if (strapiRes.ok) {
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', data.jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 60 * 60 * 24 * 7, //1 week
          sameSite: 'strict',
          path: '/',
        })
      );
      res.status(200).json({ user: data.user });
    } else {
      res
        .status(data.statusCode)
        .json({ message: data.message[0].messages[0].message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method: ${req.method} not allowed` });
  }
};

// First Step:

// make an endpoint in next api (here) so the login method in AuthContext can hit when user clicks on login button with his email and password . when he does he sends a post request to the next api whose body has the identifier (email) and the password.

// The Login method in AuthContext
// const login = async ({ email: identifier, password }) => {

//   const res = await fetch(`${NEXT_URL}/api/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ identifier, password }),
//   });
//   const data = await res.json();  This data at this point is just an empty object which our api is sending as the response
//
//

// export default async (req, res) => {
//   if (req.method === 'POST') {

//   console.log(req.body) ==> {identifier: 'john@gmail.com, password:'123456}
//     const { identifier, password } = req.body;

//     res.status(200).json({ }); // The response sent to the frontend
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).json({ message: `Method: ${req.method} not allowed` });
//   }
// };

// Second Step:
// what we have to do next is to fetch the user inside next api (here) so this time we need to make a post request to the localhost:1337/auth/local (for login) ... the response would be a user object which includes the user itself as well as its jwt token which has to be stored as a httpOnly cookie here! and the user without the jwt will be sent as the actual response instead of an empty object in the first step
