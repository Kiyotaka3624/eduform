import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './NoticeAdd.css';

interface Notice {
  제목: string;
  부제목: string;
  내용: string;
}

const NoticeAdd: React.FC = () => {
  const [newNotice, setNewNotice] = useState<Notice>({ 제목: '', 부제목: '', 내용: '' });
  const navigate = useNavigate();

  // 관리자가 아니면 리다이렉트
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/', { replace: true });
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'ADMIN') {
        navigate('/', { replace: true });
      }
    } catch {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewNotice(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const saved: Notice[] = JSON.parse(localStorage.getItem('notices') || '[]');
    const updated = [...saved, newNotice];
    localStorage.setItem('notices', JSON.stringify(updated));
    navigate('/notices');
  };

  return (
    <div className="notice-add">
      <h2>공지사항 추가</h2>
      <form onSubmit={handleSubmit} className="na-form">
        <label>
          제목
          <input
            type="text"
            name="제목"
            value={newNotice.제목}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          부제목
          <input
            type="text"
            name="부제목"
            value={newNotice.부제목}
            onChange={handleChange}
          />
        </label>
        <label>
          내용
          <textarea
            name="내용"
            value={newNotice.내용}
            onChange={handleChange}
            rows={6}
            required
          />
        </label>
        <button type="submit" className="na-btn-submit">추가하기</button>
      </form>
    </div>
  );
};

export default NoticeAdd;
