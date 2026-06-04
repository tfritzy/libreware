import { useAuth } from "../lib/AuthContext";
import { useState } from "react";
import { SignInModal } from "./SignInModal";
import { AnonymousAvatar } from "./AnonymousAvatar";

export function Profile() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const img = user?.photoURL ? (
    <img src={user?.photoURL || undefined} className="w-10 h-10 rounded-full" />
  ) : (
    <AnonymousAvatar />
  );

  return (
    <div className="relative">
      <button
        className="cursor-pointer rounded-full border border-zinc-900"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {img}
      </button>

      {menuOpen && (
        <SignInModal open={menuOpen} setOpen={(open) => setMenuOpen(open)} />
      )}
    </div>
  );
}
