export async function fetchAuth(path, opts = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5000/api${path}`, {
    headers: {
      ...opts.headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
    ...opts,
  });
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return res;
}
