// TrainingDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './TrainingDetail.css';

interface Training {
  tId: number;
  title: string;
  content: string;
  imageUrl?: string;
  viewCount: number;
}

export default function TrainingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  const getEmail = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
      return payload.email;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const email = getEmail();
    if (!id) return navigate('/trainings', { replace: true });

    axios.get(`/api/trainings/${id}`)
      .then(res => {
        setTraining(res.data);
      })
      .catch(() => {
        toast.error('훈련 정보를 불러오지 못했습니다.');
        navigate('/trainings', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleApply = () => {
    const email = getEmail();
    if (!email) {
      toast.error('로그인 후 신청해주세요.');
      navigate('/login');
      return;
    }
    axios.post(`/api/trainings/${id}/apply`, {}, { params: { email } })
      .then(() => toast.success('신청이 완료되었습니다!'))
      .catch(err => {
        if (err.response?.status === 409) {
          toast.info('이미 신청하셨습니다.');
        } else {
          toast.error('신청 중 오류 발생.');
        }
      });
  };

  if (loading) return <p className="td-loading">로딩 중…</p>;
  if (!training) return <p className="td-not-found">해당 훈련을 찾을 수 없습니다.</p>;

  return (
    <div className="td-wrapper">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <div className="td-card">
        {training.imageUrl && (
          <div className="td-image-wrap">
            <img
              src={`/api/proxy/image?url=${encodeURIComponent(training.imageUrl)}`}
              alt={training.title}
              className="td-image"
            />
          </div>
        )}

        <h2 className="td-title">{training.title}</h2>
        <p className="td-content">{training.content}</p>

        <div className="td-meta">
          <span className="td-views">조회수: {training.viewCount}</span>
        </div>

        <div className="td-actions">
          <button className="td-apply-btn" onClick={handleApply}>신청하기</button>
        </div>

        <Link to="/trainings" className="td-back">← 목록으로 돌아가기</Link>
      </div>
    </div>
  );
}
