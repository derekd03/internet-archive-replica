import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Layout from "./components/Layout";
import Search from "./pages/search";
import Details from "./pages/details";
import Create from "./pages/create";
import Upload from "./pages/upload";
import Edit from "./pages/edit";
import "./App.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/create" element={<Create />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;