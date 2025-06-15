// RecruitBoard.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RecruitBoard.css';

interface Recruit {
  rid: number;
  title: string;
  content: string;
  imageUrl?: string;
  viewCount: number;
}

export default function RecruitBoard() {
  const [recruits, setRecruits] = useState<Recruit[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<Recruit[]>('/api/recruits')
      .then(res => {
        setRecruits(res.data);
      })
      .catch(err => console.error('채용 목록 로드 실패:', err));

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { role: r } = JSON.parse(atob(token.split('.')[1]));
        setRole(r);
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <div className="rb-wrapper">
      <div className="rb-header">
        <h2 className="rb-title">채용 게시판</h2>
        {role === 'ADMIN' && (
          <button
            className="rb-add-btn"
            onClick={() => navigate('/recruits/add')}
          >
            + 채용 등록
          </button>
        )}
      </div>
      {recruits.length === 0 ? (
        <p className="rb-empty">등록된 채용 공고가 없습니다.</p>
      ) : (
        <div className="rb-list">
          {recruits.map(r => (
            <Link key={r.rid} to={`/recruits/${r.rid}`} className="rb-card">
              <div className="rb-id">ID: {r.rid}</div>
              {r.imageUrl && (
                <div className="rb-thumb-wrapper">
                  <img src={r.imageUrl} alt={r.title} className="rb-thumb" />
                </div>
              )}
              <div className="rb-info">
                <h3 className="rb-info-title">{r.title}</h3>
                <p className="rb-info-content">
                  {r.content.length > 80 ? r.content.slice(0, 80) + '…' : r.content}
                </p>
                <span className="rb-info-views">조회 {r.viewCount}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
