import { auth } from "./lib/firebase";
import { signInAnonymously, signOut } from "firebase/auth";
import { useAuth } from "./lib/AuthContext";
import { BoardComponent } from "./components/Board";

function App() {
  const { user } = useAuth();
  const boardId = "board_alsdkfjlkasj";

  const handleLogin = () => signInAnonymously(auth);
  const handleLogout = () => signOut(auth);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Firebase Kanban Lite
          </h1>
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
          <BoardComponent id={boardId} />
        </main>
      </div>
    </div>
  );
}

export default App;
