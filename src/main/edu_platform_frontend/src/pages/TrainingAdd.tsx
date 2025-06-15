import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TrainingAdd.css';

interface TrainingForm {
  title: string;
  content: string;
  imageUrl: string;
}

export default function TrainingAdd() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [form, setForm] = useState<TrainingForm>({ title: '', content: '', imageUrl: '' });

  // 권한 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/', { replace: true });
    try {
      const { role: r } = JSON.parse(atob(token.split('.')[1]));
      setRole(r);
      if (r !== 'ADMIN' && r !== 'PROFESSOR') navigate('/', { replace: true });
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
        '/api/trainings',
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/trainings');
    } catch (err) {
      console.error(err);
      alert('훈련 등록에 실패했습니다.');
    }
  };

  if (role === null || (role !== 'ADMIN' && role !== 'PROFESSOR')) return null;

  return (
    <div className="ta-wrapper">
      <h2 className="ta-heading">훈련 추가하기</h2>
      <form className="ta-form" onSubmit={handleSubmit}>
        <div className="ta-group">
          <label htmlFor="title">제목</label>
          <input id="title" name="title" type="text" value={form.title} onChange={handleChange} required />
        </div>
        <div className="ta-group">
          <label htmlFor="content">내용</label>
          <textarea id="content" name="content" rows={6} value={form.content} onChange={handleChange} required />
        </div>
        <div className="ta-group">
          <label htmlFor="imageUrl">이미지 URL</label>
          <input id="imageUrl" name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} />
        </div>
        <button type="submit" className="ta-submit">등록하기</button>
      </form>
    </div>
  );
}
