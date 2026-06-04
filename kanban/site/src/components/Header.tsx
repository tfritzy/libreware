import { Profile } from "./Profile";

export function Header() {
  return (
    <header className="flex flex-col backdrop-blur-xl bg-white/15 brightness-110 items-center mb-8 border-b border-white/5 py-2  ">
      <div className="container w-full flex justify-between px-2">
        <button className="cursor-pointer hover:bg-white/10 rounded px-3 py-1">
          <h1 className="text-zinc-900/90 text-lg font-semibold tracking-tight">
            Libre todo
          </h1>
        </button>

        <Profile />
      </div>
    </header>
  );
}
