import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Layout from "./components/Layout";
import About from "./pages/about";
import Search from "./pages/search";
import Details from "./pages/details";
import Create from "./pages/create";
import Upload from "./pages/upload";
import "./App.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/details" element={<Details />} />
          <Route path="/create" element={<Create />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;