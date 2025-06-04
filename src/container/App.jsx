import { useState } from "react";
import "./App.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/HomePage";
import { path } from "../utils/constant";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={path.HOME} element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
