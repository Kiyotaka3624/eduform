import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-text">
        © {new Date().getFullYear()} EduForm. All rights reserved.
      </div>
    </footer>
  );
}
