// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const navItems = [
  { label: '공지 사항', to: '/notices' },
  { label: '강의 수강', to: '/lectures' },
  { label: '훈련', to: '/trainings' },
  { label: '채용 게시판', to: '/recruits' },
  { label: 'Q&A', to: '/qna' },
];

// JWT payload parser that handles Unicode correctly
function parseJwt(token: string): { username?: string } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const decoded = new TextDecoder('utf-8').decode(bytes);
    return JSON.parse(decoded);
  } catch (e) {
    console.error('JWT parse error', e);
    return null;
  }
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 경로 변경 시 메뉴/드롭다운 닫기 및 로그인 상태 갱신
  useEffect(() => {
    setOpen(false);
    setShowDropdown(false);
    const token = localStorage.getItem('token');
    if (token) {
      const payload = parseJwt(token);
      if (payload?.username) {
        setUser(payload.username);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  // PC에서 리사이즈 시 메뉴/드롭다운 닫기
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1000) {
        setOpen(false);
        setShowDropdown(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShowDropdown(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="header">
      <div className="wrapper">
        <Link to="/" className="logo">
          <span className="logo-edu">Edu</span>
          <span className="logo-form">Form</span>
        </Link>

        {/* 데스크탑 네비 */}
        <nav className="nav-desktop">
          <ul className="nav-list">
            {navItems.map(({ label, to }) => (
              <li key={to} className="nav-item">
                <Link to={to} className="nav-link">{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 인증/유저 메뉴 (데스크탑) */}
        <div className="auth-desktop">
          {!user ? (
            <>
              <Link to="/signup" className="btn">회원가입</Link>
              <Link to="/login" className="btn">로그인</Link>
            </>
          ) : (
            <div className="user-menu">
              <button
                className="username-btn"
                onClick={() => setShowDropdown(d => !d)}
              >
                {user}
              </button>
              {showDropdown && (
                <ul className="dropdown">
                  <li><Link to="/settings">계정 설정</Link></li>
                  <li><Link to="/training-status">훈련 현황</Link></li>
                  <li><Link to="/jobs-status">취업 현황</Link></li>
                  <li><button onClick={handleLogout}>로그아웃</button></li>
                </ul>
              )}
            </div>
          )}
        </div>

        {/* 햄버거 토글 */}
        <button className="toggle" onClick={() => setOpen(o => !o)}>
          {open ? <X className="icon" /> : <Menu className="icon" />}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      <div className={`mobile-menu${open ? ' open' : ''}`}>
        <ul className="mobile-nav-items">
          {navItems.map(({ label, to }) => (
            <li key={to} className="mobile-nav-item">
              <Link to={to} className="mobile-link">{label}</Link>
            </li>
          ))}
          {!user ? (
            <>
              <li className="mobile-nav-item">
                <Link to="/signup" className="mobile-link">회원가입</Link>
              </li>
              <li className="mobile-nav-item">
                <Link to="/login" className="mobile-link">로그인</Link>
              </li>
            </>
          ) : (
            <>
              <li className="mobile-nav-item">
                <Link to="/mypage" className="mobile-link">마이페이지</Link>
              </li>
              <li className="mobile-nav-item">
                <button
                  onClick={handleLogout}
                  className="mobile-link button-as-link"
                >
                  로그아웃
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}