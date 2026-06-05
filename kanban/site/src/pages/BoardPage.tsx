import { useParams } from "react-router-dom";
import { BoardComponent } from "../components/Board";
import { Header } from "../components/Header";

export function BoardPage() {
  const boardId = useParams().boardId;

  return (
    <div className="min-h-screen text-black bg-[url('/backgrounds/nature/john-towner-JgOeRuGD_Y4-unsplash.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
      <Header />

      <div className="container mx-auto">
        <main>
          <BoardComponent id={boardId} />
        </main>
      </div>
    </div>
  );
}
