import { useState, useEffect } from 'react'
import { auth, db } from './lib/firebase'
import { signInAnonymously, signOut } from 'firebase/auth'
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore'
import { useAuth } from './lib/AuthContext'

interface Note {
  id: string;
  text: string;
  createdAt: Timestamp;
}

function App() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      setNotes(notesData);
    });

    return unsubscribe;
  }, [user]);

  const handleLogin = () => signInAnonymously(auth);
  const handleLogout = () => signOut(auth);

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    await addDoc(collection(db, 'notes'), {
      text: newNote,
      createdAt: Timestamp.now(),
      userId: user?.uid
    });
    setNewNote('');
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
          <h1 className="text-2xl font-bold tracking-tight">Firebase Kanban Lite</h1>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400 font-mono bg-zinc-800 px-2 py-1 rounded">
                UID: {user.uid.slice(0, 8)}...
              </span>
              <button 
                onClick={handleLogout}
                className="bg-zinc-100 text-zinc-900 px-4 py-2 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-500 transition-colors"
            >
              Login Anonymously
            </button>
          )}
        </header>

        <main>
          {user ? (
            <section>
              <form onSubmit={addNote} className="flex gap-2 mb-10">
                <input 
                  type="text" 
                  value={newNote} 
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write a note..."
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button 
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-500 transition-colors"
                >
                  Add Note
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map(note => (
                  <div key={note.id} className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow-sm hover:border-zinc-600 transition-colors">
                    <p className="text-zinc-200 mb-4 leading-relaxed">{note.text}</p>
                    <div className="text-xs text-zinc-500 font-medium">
                      {note.createdAt?.toDate().toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <div className="text-center py-20">
              <p className="text-zinc-500 text-lg">Please login to start managing your notes.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
