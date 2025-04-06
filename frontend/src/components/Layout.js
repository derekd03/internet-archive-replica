// components/Layout.js
import Header from './header/Header';
import Footer from './footer/Footer';

export default function Layout({ children }) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
}