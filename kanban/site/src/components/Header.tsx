import { CircuitBoard } from "lucide-react";
import { Profile } from "./Profile";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="flex flex-col backdrop-blur-xl bg-white/15 brightness-110 items-center mb-8 border-b border-white/5 py-1  ">
      <div className="container w-full flex justify-between px-2">
        <div className="flex flex-row space-x-1 items-center">
          <Link to="/">
            <div className="cursor-pointer rounded-lg hover:bg-white/10 p-1">
              <CircuitBoard
                className="stroke-white stroke-1 scale-125"
                size={32}
              />
            </div>
          </Link>

          <button className="cursor-pointer hover:bg-white/10 rounded px-3 py-1">
            <h1 className="text-zinc-900/90 text-lg font-semibold tracking-tight">
              Libre todo
            </h1>
          </button>
        </div>

        <Profile />
      </div>
    </header>
  );
}
