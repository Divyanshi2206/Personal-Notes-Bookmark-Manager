'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [form, setForm] = useState({ url: '', title: '', description: '', tags: '' });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchBookmarks = async () => {
    const params = new URLSearchParams();
    if (search) params.append('q', search);
    if (tagFilter) params.append('tags', tagFilter);

    const res = await fetch(`http://localhost:5000/api/bookmarks?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setBookmarks(data);
  };

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
    } else {
      fetchBookmarks();
    }
  }, [search, tagFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()),
    };

    const url = editingId
      ? `http://localhost:5000/api/bookmarks/${editingId}`
      : 'http://localhost:5000/api/bookmarks';

    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(editingId ? 'Bookmark updated!' : 'Bookmark added!');
    } else {
      toast.error('Operation failed');
    }

    setForm({ url: '', title: '', description: '', tags: '' });
    setEditingId(null);
    fetchBookmarks();
  };

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:5000/api/bookmarks/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) toast.success('Bookmark deleted!');
    else toast.error('Delete failed');

    fetchBookmarks();
  };

  const toggleFavorite = async (id, currentStatus) => {
    await fetch(`http://localhost:5000/api/bookmarks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ favorite: !currentStatus }),
    });
    fetchBookmarks();
  };

  const handleEdit = (bm) => {
    setForm({
      url: bm.url,
      title: bm.title,
      description: bm.description,
      tags: bm.tags.join(', '),
    });
    setEditingId(bm._id);
  };

  const cancelEdit = () => {
    setForm({ url: '', title: '', description: '', tags: '' });
    setEditingId(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-purple-800">🔖 Bookmark Manager</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4 mb-8">
        <input
          type="url"
          className="w-full border px-4 py-2 rounded-md text-black"
          placeholder="Bookmark URL"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          required
        />
        <input
          type="text"
          className="w-full border px-4 py-2 rounded-md text-black"
          placeholder="Title (auto-fetch if empty)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="w-full border px-4 py-2 rounded-md text-black"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="text"
          className="w-full border px-4 py-2 rounded-md text-black"
          placeholder="Tags (comma-separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />

        <div className="flex gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer">
            {editingId ? 'Update Bookmark' : 'Add Bookmark'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-gray-500 underline cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 border px-4 py-2 rounded-md text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by tag"
          className="flex-1 border px-4 py-2 rounded-md text-white"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {bookmarks.map((bm) => (
          <div
            key={bm._id}
            className="bg-white p-4 rounded-lg shadow border relative transition hover:shadow-md"
          >
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => toggleFavorite(bm._id, bm.favorite)}
                title="Toggle Favorite"
                className="text-yellow-500 hover:text-yellow-600 text-xl cursor-pointer"
              >
                {bm.favorite ? '⭐' : '☆'}
              </button>
              <button
                onClick={() => handleEdit(bm)}
                title="Edit"
                className="text-green-500 hover:text-green-600 text-xl cursor-pointer"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(bm._id)}
                title="Delete"
                className="text-red-500 hover:text-red-600 text-xl cursor-pointer"
              >
                🗑️
              </button>
            </div>

            <a href={bm.url} target="_blank" rel="noopener noreferrer">
              <h3 className="text-lg font-semibold text-blue-900">{bm.title}</h3>
            </a>
            <p className="text-sm text-gray-700">{bm.description}</p>

            <div className="mt-2 flex flex-wrap gap-2">
              {bm.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-purple-100 text-blue-800 px-2 py-1 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
        {bookmarks.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No bookmarks found. Add one above!</p>
        )}
      </div>
    </div>
  );
}
