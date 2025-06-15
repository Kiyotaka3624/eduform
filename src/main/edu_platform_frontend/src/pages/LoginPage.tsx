import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { username } = JSON.parse(atob(token.split('.')[1]));
        if (username) navigate('/', { replace: true });
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log(res)
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || '이메일 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      localStorage.setItem('token', data.token);
      navigate('/', { replace: true });

    } catch (err) {
      console.error(err);
      toast.error('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 모바일 여부 판단
  const isMobile = window.innerWidth <= 480;

  return (
    <div className="login-wrapper">
      <ToastContainer
        position={isMobile ? "bottom-center" : "top-right"}
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        draggable={false}
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        style={
          !isMobile
            ? { top: 'calc(var(--header-height) + 1rem)', right: '1rem' }
            : {}
        }
      />

      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-heading">EduForm에 오신 것을 환영합니다</h2>

        <div className="input-group">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-login">로그인</button>

        <p className="signup-prompt">
          아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
        </p>
      </form>
    </div>
  );
}
