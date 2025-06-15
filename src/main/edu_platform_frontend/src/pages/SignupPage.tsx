import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignupPage.css';

export default function SignupPage() {
  const [form, setForm] = useState({
    email: '', password: '', name: '',
    phone: '', address: '', role: 'student',
    studentNumber: '', major: '', grade: '',
    imageUrl: '', department: '',
    position: '', authorityLevel: ''
  });

  
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 480;
useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token)
    if (token) {
    try {
        const { username } = JSON.parse(atob(token.split('.')[1]));
        if (username) navigate('/', { replace: true });
    } catch {
        localStorage.removeItem('token');
    }
    }
}, [navigate]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

const handleSubmit = async e => {
  e.preventDefault();

  // 👉 role에 따라 payload 구성
  const payload = {
    email: form.email,
    password: form.password,
    name: form.name,
    phone: form.phone,
    address: form.address,
    role: form.role.toUpperCase(), // 서버에서 Role enum과 매칭되게
  };

  if (form.role === 'student') {
    payload.student = {
      studentNumber: form.studentNumber,
      major: form.major,
      grade: parseInt(form.grade),
    };
  } else if (form.role === 'professor') {
    payload.professor = {
      imageUrl: form.imageUrl,
      department: form.department,
    };
  } else if (form.role === 'admin') {
    payload.admin = {
      position: form.position,
      authorityLevel: parseInt(form.authorityLevel),
    };
  }

  try {
    console.log("📤 Payload:", payload);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.status === 201) {
      toast.success('회원가입이 완료되었습니다!');
      setTimeout(() => navigate('/login'), 1500);
    } else {
      if (typeof result === 'object') {
        Object.values(result).forEach(msg => toast.error(msg));
      } else {
        toast.error(result.message || '회원가입에 실패했습니다.');
      }
    }
  } catch (err) {
    console.error("❌ 서버 오류:", err);
    toast.error('서버 오류가 발생했습니다.');
  }
};

  return (
    <div className="signup-wrapper">
      <ToastContainer
        position={isMobile ? "bottom-center" : "top-right"}
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable={false}
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        style={!isMobile ? { top: 'calc(var(--header-height) + 1rem)', right: '1rem' } : {}}
      />

      <form className="signup-card" onSubmit={handleSubmit}>
        <h2 className="signup-heading">회원가입</h2>

        {['email','password','name','phone','address'].map(field => (
          <div className="input-group" key={field}>
            <label htmlFor={field}>{{
              email:'이메일', password:'비밀번호',
              name:'이름', phone:'전화번호', address:'주소'
            }[field]}</label>
            <input
              id={field}
              name={field}
              type={field==='password'?'password':'text'}
              placeholder={field==='email'?'you@example.com':''}
              value={form[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <div className="input-group">
          <label htmlFor="role">역할</label>
          <select name="role" id="role" value={form.role} onChange={handleChange}>
            <option value="student">학생</option>
            <option value="professor">교수</option>
            <option value="admin">관리자</option>
          </select>
        </div>

        {/* 학생 정보 */}
        {form.role === 'student' && (
          <>
            <div className="input-group">
              <label htmlFor="studentNumber">학번</label>
              <input
                id="studentNumber"
                name="studentNumber"
                value={form.studentNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="major">전공</label>
              <input id="major" name="major" value={form.major} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label htmlFor="grade">학년</label>
              <input
                id="grade"
                name="grade"
                type="number"
                min="1"
                max="6"
                value={form.grade}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        {/* 교수 정보 */}
        {form.role === 'professor' && (
          <>
            <div className="input-group">
              <label htmlFor="imageUrl">프로필 이미지 URL</label>
              <input id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="department">학과</label>
              <input id="department" name="department" value={form.department} onChange={handleChange} />
            </div>
          </>
        )}

        {/* 관리자 정보 */}
        {form.role === 'admin' && (
          <>
            <div className="input-group">
              <label htmlFor="position">직위</label>
              <input id="position" name="position" value={form.position} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="authorityLevel">권한 레벨</label>
              <input
                id="authorityLevel"
                name="authorityLevel"
                type="number"
                min="1"
                max="10"
                value={form.authorityLevel}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="btn-signup">회원가입</button>
        <p className="login-link">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </form>
    </div>
  );
}
