import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Layout from "./components/Layout";
import Search from "./pages/search";
import Create from "./pages/create";
import Upload from "./pages/upload";

const Details = lazy(() => import('./pages/details'));
const Edit = lazy(() => import('./pages/edit'));

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/create" element={<Create />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/edit/:id" element={<Edit />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;