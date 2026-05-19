import { useEffect, useState } from 'react'
import { useAuth } from './lib/useAuth'
import { isSupabaseConfigured, supabase } from './lib/supabase'

interface Note {
  id: string
  text: string
  created_at: string
  user_id: string | null
}

function App() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  useEffect(() => {
    if (!user || !supabase) {
      return
    }

    const client = supabase
    let isActive = true

    const loadNotes = async () => {
      const { data, error } = await client
        .from('notes')
        .select('id, text, created_at, user_id')
        .order('created_at', { ascending: false })

      if (!isActive) {
        return
      }

      if (error) {
        setStatusMessage(error.message)
        return
      }

      setNotes(data ?? [])
      setStatusMessage(null)
    }

    void loadNotes()

    const channel = client
      .channel('notes-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, () => {
        void loadNotes()
      })
      .subscribe()

    return () => {
      isActive = false
      void client.removeChannel(channel)
    }
  }, [user])

  const handleLogin = async () => {
    if (!supabase) {
      return
    }

    setIsAuthenticating(true)
    setStatusMessage(null)

    const { error } = await supabase.auth.signInAnonymously()

    if (error) {
      setStatusMessage(error.message)
    }

    setIsAuthenticating(false)
  }

  const handleLogout = async () => {
    if (!supabase) {
      return
    }

    setIsAuthenticating(true)
    setStatusMessage(null)

    const { error } = await supabase.auth.signOut()

    if (error) {
      setStatusMessage(error.message)
    }

    setIsAuthenticating(false)
  }

  const addNote = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!supabase || !user) {
      return
    }

    const trimmedNote = newNote.trim()

    if (!trimmedNote) {
      return
    }

    setIsSubmitting(true)
    setStatusMessage(null)

    const { error } = await supabase.from('notes').insert({
      text: trimmedNote,
      user_id: user.id,
    })

    if (error) {
      setStatusMessage(error.message)
    } else {
      setNewNote('')
    }

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-4 text-zinc-100 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 flex items-center justify-between border-b border-zinc-800 pb-6">
          <h1 className="text-2xl font-bold tracking-tight">Supabase Kanban Lite</h1>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="rounded bg-zinc-800 px-2 py-1 font-mono text-sm text-zinc-400">
                UID: {user.id.slice(0, 8)}...
              </span>
              <button
                onClick={() => void handleLogout()}
                disabled={isAuthenticating}
                className="rounded-lg bg-zinc-100 px-4 py-2 font-semibold text-zinc-900 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => void handleLogin()}
              disabled={!isSupabaseConfigured || isAuthenticating}
              className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Login Anonymously
            </button>
          )}
        </header>

        <main>
          {!isSupabaseConfigured ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-amber-100">
              <h2 className="mb-2 text-lg font-semibold">Supabase is not configured yet.</h2>
              <p className="text-sm text-amber-50/80">
                Add <code className="font-mono">VITE_SUPABASE_URL</code> and{' '}
                <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> in a{' '}
                <code className="font-mono">.env.local</code> file, then run the SQL in{' '}
                <code className="font-mono">kanban/supabase/schema.sql</code>.
              </p>
            </div>
          ) : user ? (
            <section>
              {statusMessage ? (
                <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {statusMessage}
                </div>
              ) : null}

              <form onSubmit={(event) => void addNote(event)} className="mb-10 flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(event) => setNewNote(event.target.value)}
                  placeholder="Write a note..."
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-emerald-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving…' : 'Add Note'}
                </button>
              </form>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-xl border border-zinc-700 bg-zinc-800 p-6 shadow-sm transition-colors hover:border-zinc-600"
                  >
                    <p className="mb-4 leading-relaxed text-zinc-200">{note.text}</p>
                    <div className="text-xs font-medium text-zinc-500">
                      {new Date(note.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <div className="py-20 text-center">
              {statusMessage ? (
                <div className="mx-auto mb-6 max-w-xl rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {statusMessage}
                </div>
              ) : null}
              <p className="text-lg text-zinc-500">Please login to start managing your notes.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
