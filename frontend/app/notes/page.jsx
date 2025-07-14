'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function NotesPage() {
    
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  const [token, setToken] = useState(null); // ✅ Add this line

  const fetchNotes = async () => {
    const params = new URLSearchParams();
    if (search) params.append('q', search);
    if (tagFilter) params.append('tags', tagFilter);

    const res = await fetch(`http://localhost:5000/api/notes?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setNotes(data);
  };

 useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) {
      window.location.href = '/login';
    } else {
      setToken(t);
    }
  }, []);

  useEffect(() => {
    if (token) fetchNotes();
  }, [search, tagFilter, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()),
    };

    const res = await fetch('http://localhost:5000/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) toast.success('Note added!');
    else toast.error('Failed to add note');

    setForm({ title: '', content: '', tags: '' });
    fetchNotes();
  };

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) toast.success('Note deleted');
    else toast.error('Delete failed');

    fetchNotes();
  };

  const toggleFavorite = async (id, currentStatus) => {
    await fetch(`http://localhost:5000/api/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ favorite: !currentStatus }),
    });
    fetchNotes();
  };

  const handleEdit = (note) => {
    setForm({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', '),
    });
    setEditingNoteId(note._id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()),
    };

    const res = await fetch(`http://localhost:5000/api/notes/${editingNoteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) toast.success('Note updated!');
    else toast.error('Update failed');

    setForm({ title: '', content: '', tags: '' });
    setEditingNoteId(null);
    fetchNotes();
  };

  // ... (return JSX stays the same)


  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">📝 Notes Manager</h1>

      <form onSubmit={editingNoteId ? handleUpdate : handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4 mb-8">
        <input
          type="text"
          className="w-full border px-4 py-2 rounded-md text-black"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className="w-full border px-4 py-2 rounded-md text-black"
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <input
          type="text"
          className="w-full border px-4 py-2 rounded-md text-black"
          placeholder="Tags (comma-separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer">
          {editingNoteId ? 'Update Note' : 'Add Note'}
        </button>
        {editingNoteId && (
          <button
            type="button"
            className="ml-4 text-gray-600 underline cursor-pointer"
            onClick={() => {
              setForm({ title: '', content: '', tags: '' });
              setEditingNoteId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search text..."
          className="flex-1 border px-4 py-2 rounded-md text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by tag..."
          className="flex-1 border px-4 py-2 rounded-md text-white"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-white p-4 rounded-lg shadow border relative transition hover:shadow-md"
          >
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => toggleFavorite(note._id, note.favorite)}
                title="Toggle Favorite"
                className="text-yellow-500 hover:text-yellow-600 text-xl cursor-pointer"
              >
                {note.favorite ? '⭐' : '☆'}
              </button>
              <button
                onClick={() => handleEdit(note)}
                title="Edit"
                className="text-green-500 hover:text-green-600 text-xl cursor-pointer"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(note._id)}
                title="Delete"
                className="text-red-500 hover:text-red-600 text-xl cursor-pointer"
              >
                🗑️
              </button>
            </div>

            <h3 className="text-lg font-semibold text-blue-900">{note.title}</h3>
            <p className="text-sm text-gray-700">{note.content}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {note.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No notes found. Add one above!</p>
        )}
      </div>
    </div>
  );
}
