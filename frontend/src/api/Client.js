const BASE_URL = 'http://localhost:5000/api';
function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      // don't set Content-Type for FormData — the browser sets the correct
      // multipart boundary automatically; setting it manually breaks uploads
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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
  getOne: (grno) => request(`/student/getstudent/${grno}`),
  create: (payload) =>
    request('/student/addstudent', { method: 'POST', body: JSON.stringify(payload) }),
  update: (grno, payload) =>
    request(`/student/update/${grno}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (grno) =>
    request(`/student/deletestudent/${grno}`, { method: 'DELETE' })
};

export const certificateApi = {
  issue: (payload) =>
    request('/certificate/issue', { method: 'POST', body: JSON.stringify(payload) }),
  get: (grno) => request(`/certificate/${grno}`),
  viewPdf: async (grno) => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/certificate/${grno}/pdf`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Could not load certificate PDF');
    const blob = await res.blob();
    window.open(URL.createObjectURL(blob), '_blank');
  }
};

export const resultCardApi = {
  create: (payload) => request('/resultcard/create', { method: 'POST', body: JSON.stringify(payload) }),
  viewPdf: async (id) => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/resultcard/${id}/pdf`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Could not load PDF');
    const blob = await res.blob();
    window.open(URL.createObjectURL(blob), '_blank');
  }
};

export const feeApi = {
  generate: (payload) => request('/fee/generate', { method: 'POST', body: JSON.stringify(payload) }),
  markPaid: (id) => request(`/fee/${id}/pay`, { method: 'PUT' }),
  getByStudent: (grno) => request(`/fee/${grno}`),
  getAllUnpaid: () => request('/fee/unpaid'),
  viewReceipt: async (id) => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/fee/${id}/receipt`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Could not load receipt');
    const blob = await res.blob();
    window.open(URL.createObjectURL(blob), '_blank');
  }
};

export const importApi = {
  preview: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/student/import/preview', { method: 'POST', body: formData });
  },
  confirm: (rows) =>
    request('/student/import/confirm', { method: 'POST', body: JSON.stringify({ rows }) })
};