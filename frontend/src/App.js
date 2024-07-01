import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//Component
import FilePage from "./pages/FilePage.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FilePage />} />
      </Routes>
    </Router>
  );
}

export default App;