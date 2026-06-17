import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar/Navbar';
import Footer from '../common/Footer/Footer';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
