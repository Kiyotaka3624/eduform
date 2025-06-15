// RecruitAdd.tsx
import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RecruitAdd.css';

interface RecruitForm {
  title: string;
  content: string;
  imageUrl: string;
}

export default function RecruitAdd() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [form, setForm] = useState<RecruitForm>({ title: '', content: '', imageUrl: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/', { replace: true });
    try {
      const { role: r } = JSON.parse(atob(token.split('.')[1]));
      setRole(r);
      if (r !== 'ADMIN') navigate('/', { replace: true });
    } catch {
      localStorage.removeItem('token');
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/recruits',
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/recruits');
    } catch (err) {
      console.error(err);
      alert('채용 등록에 실패했습니다.');
    }
  };

  if (role === null || role !== 'ADMIN') return null;

  return (
    <div className="ra-wrapper">
      <h2 className="ra-heading">채용 공고 추가</h2>
      <form className="ra-form" onSubmit={handleSubmit}>
        <div className="ra-group">
          <label htmlFor="title">제목</label>
          <input id="title" name="title" type="text" value={form.title} onChange={handleChange} required />
        </div>
        <div className="ra-group">
          <label htmlFor="content">내용</label>
          <textarea id="content" name="content" rows={6} value={form.content} onChange={handleChange} required />
        </div>
        <div className="ra-group">
          <label htmlFor="imageUrl">이미지 URL</label>
          <input id="imageUrl" name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} />
        </div>
        <button type="submit" className="ra-submit">등록하기</button>
      </form>
    </div>
  );
}
