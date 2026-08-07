const BASE_URL = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const studentApi = {
  getAll: () => request('/student/getallstudents'),
  getOne: (grno) => request(`/student/student/${grno}`),
  create: (payload) =>
    request('/student/addstudent', { method: 'POST', body: JSON.stringify(payload) }),
  update: (grno, payload) =>
    request(`/student/update/${grno}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (grno) =>
    request(`/student/deletestudent/${grno}`, { method: 'DELETE' })
};