import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TrainingBoard.css';

interface Training {
  tid: number;
  title: string;
  content: string;
  imageUrl?: string;
  viewCount: number;
}

const TrainingBoard: React.FC = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1) 훈련 목록 불러오기
    axios.get<Training[]>('/api/trainings')
      .then(res => {
        if (Array.isArray(res.data)) {
          setTrainings(res.data);
          console.log(res.data)
        } else {
          console.error('Unexpected trainings response:', res.data);
        }
      })
      .catch(err => {
        console.error('훈련 목록 로드 중 에러:', err);
      });

    // 2) 토큰에서 role 파싱
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
    <div className="tb-wrapper">
      <div className="tb-header">
        <h2 className="tb-title">훈련 게시판</h2>
        {(role === 'ADMIN' || role === 'PROFESSOR') && (
          <button
            className="tb-add-btn"
            onClick={() => navigate('/trainings/add')}
          >
            + 훈련 추가하기
          </button>
        )}
      </div>

      {trainings.length === 0 ? (
        
        <p className="tb-empty">아직 등록된 훈련이 없습니다.</p>
      ) : (
        <div className="tb-list">
          {trainings.map(t => (
            <Link key={t.tid} to={`/trainings/${t.tid}`} className="tb-card">
              {/* ID 표시 */}
              <div className="tb-id">ID: {t.tid}</div>

              {/* 썸네일 */}
              {t.imageUrl && (
                <div className="tb-thumb-wrapper">
                  <img
                    src={t.imageUrl}
                    alt={t.title}
                    className="tb-thumb"
                  />
                </div>
              )}

              {/* 정보 */}
              <div className="tb-info">
                <h3 className="tb-info-title">{t.title}</h3>
                <p className="tb-info-content">
                  {t.content.length > 80
                    ? t.content.slice(0, 80) + '…'
                    : t.content
                  }
                </p>
                <span className="tb-info-views">조회 {t.viewCount}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingBoard;
