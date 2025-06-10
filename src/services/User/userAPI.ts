import axios from 'axios';

export const fetchUserProfile = async () => {
  const token = JSON.parse(localStorage.getItem('currentUser') || '{}')?.token;

  const res = await axios.get('http://localhost:5000/api/users/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
