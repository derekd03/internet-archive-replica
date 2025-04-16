import "./Header.css";
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="app-header">
            <nav className="header-nav">
                <div className="header-left">
                    <Link className="nav-link" to="/">
                        <img
                            width="40"
                            height="40"
                            alt="Internet Archive Logo"
                            src="/assets/ia/ia-logo-2c2c2c.03bd7e88c8814d63d0fc..svg"
                        />
                        Internet Archive<br></br>
                        Replica
                    </Link>
                </div>
                <div className="header-right">
                    <a className="upload" href="/create">
                        <svg
                            className="upload-icon"
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-labelledby="uploadTitleID uploadDescID"
                        >
                            <title id="uploadTitleID">Upload icon</title>
                            <desc id="uploadDescID">An illustration of a horizontal line over an up pointing arrow.</desc>
                            <path
                                d="m20 12.8 8 10.4h-4.8v8.8h-6.4v-8.8h-4.8zm12-4.8v3.2h-24v-3.2z"
                                fillRule="evenodd"
                            />
                        </svg>
                    </a>
                </div>
            </nav>
        </header>
    );
}
