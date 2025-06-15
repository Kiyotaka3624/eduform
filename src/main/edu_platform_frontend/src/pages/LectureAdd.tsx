// src/pages/LectureAdd.tsx
import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './LectureAdd.css';

interface Lecture {
  제목: string;
  부제목: string;
  설명: string;
  썸네일: string;
  동영상: string;  // 유튜브 URL만
}

export default function LectureAdd() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [form, setForm] = useState<Lecture>({
    제목: '',
    부제목: '',
    설명: '',
    썸네일: '',
    동영상: '',
  });

  // 권한 확인 (ADMIN, PROFESSOR 만)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/', { replace: true });
    try {
      const { role: r } = JSON.parse(atob(token.split('.')[1]));
      setRole(r);
      if (r !== 'ADMIN' && r !== 'PROFESSOR') {
        navigate('/', { replace: true });
      }
    } catch {
      localStorage.removeItem('token');
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // input/textarea 변경 핸들러
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // YouTube URL 검증 함수
  const isYouTubeUrl = (url: string) => {
    return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/.test(url);
  };

  // 제출 핸들러
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isYouTubeUrl(form.동영상)) {
      alert('유효한 YouTube 영상 URL을 입력해주세요.');
      return;
    }

    const stored = JSON.parse(localStorage.getItem('lectures') ?? '[]') as Lecture[];
    localStorage.setItem('lectures', JSON.stringify([...stored, form]));
    navigate('/lectures', { replace: true });
  };

  // 권한 로딩 중이거나 없으면 아무것도 렌더링하지 않음
  if (role === null || (role !== 'ADMIN' && role !== 'PROFESSOR')) {
    return null;
  }

  return (
    <div className="lecture-add-wrapper">
      <h2 className="la-heading">강의 추가하기</h2>
      <form className="la-form" onSubmit={handleSubmit}>
        <div className="la-group">
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            name="제목"
            value={form.제목}
            onChange={handleChange}
            required
          />
        </div>

        <div className="la-group">
          <label htmlFor="subtitle">부제목 (선택)</label>
          <input
            id="subtitle"
            type="text"
            name="부제목"
            value={form.부제목}
            onChange={handleChange}
          />
        </div>

        <div className="la-group">
          <label htmlFor="description">설명</label>
          <textarea
            id="description"
            name="설명"
            value={form.설명}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div className="la-group">
          <label htmlFor="thumbnail">썸네일 URL</label>
          <input
            id="thumbnail"
            type="url"
            name="썸네일"
            placeholder="https://example.com/thumb.jpg"
            value={form.썸네일}
            onChange={handleChange}
          />
        </div>

        <div className="la-group">
          <label htmlFor="videoUrl">YouTube 영상 URL</label>
          <input
            id="videoUrl"
            type="url"
            name="동영상"
            placeholder="https://www.youtube.com/watch?v=..."
            value={form.동영상}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="la-submit">등록하기</button>
      </form>
    </div>
  );
}
