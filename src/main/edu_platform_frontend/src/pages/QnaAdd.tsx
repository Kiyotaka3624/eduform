// QnaAdd.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './QnaAdd.css';

export default function QnaAdd(): JSX.Element {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (): Promise<void> => {
    try {
      await axios.post('/api/qna/question', {
        title,
        content,
        imageUrl,
        userId: 1 // 실제 로그인 사용자 ID로 교체 필요
      });
      navigate('/qna');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="add-container">
      <h2 className="add-title">질문 작성</h2>
      <input
        className="add-input"
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="add-textarea"
        placeholder="내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        className="add-input"
        type="text"
        placeholder="이미지 URL (선택)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button onClick={handleSubmit} className="submit-button">등록</button>
    </div>
  );
}
