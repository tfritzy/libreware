import { signInAnonymously, signOut } from "firebase/auth";
import { useAuth } from "../lib/AuthContext";
import { auth } from "../lib/firebase";

export function Header() {
  const { user } = useAuth();

  const handleLogin = () => signInAnonymously(auth);
  const handleLogout = () => signOut(auth);

  return (
    <header className="flex flex-col backdrop-blur-xl bg-white/15 brightness-110 items-center mb-8 border-b border-white/5 py-2  ">
      <div className="container w-full flex justify-between px-2">
        <button className="cursor-pointer hover:bg-white/10 rounded px-3 py-1">
          <h1 className="text-zinc-900/90 text-lg font-semibold tracking-tight">
            Wolfritz todo
          </h1>
        </button>
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
            className="bg-indigo-600 text-white px-2 py-1 rounded-lg font-semibold hover:bg-indigo-500 transition-colors"
          >
            Login Anonymously
          </button>
        )}
      </div>
    </header>
  );
}
