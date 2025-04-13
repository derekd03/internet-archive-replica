import SearchBar from "../searchBar/SearchBar";
import "./Header.css";
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="app-header">
            <nav className="header-nav">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/create" className="nav-link">Upload</Link>
            </nav>
        </header>
    );
}