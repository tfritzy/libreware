import { Routes, Route, BrowserRouter } from "react-router-dom";
import { BoardPage } from "./pages/BoardPage";
import { BoardList } from "./pages/BoardList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BoardList />} />
        <Route path="/board/:boardId" element={<BoardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
