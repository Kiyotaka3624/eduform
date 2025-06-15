// RecruitDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './RecruitDetail.css';

interface Recruit {
  rid: number;
  title: string;
  content: string;
  imageUrl?: string;
  viewCount: number;
}

export default function RecruitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recruit, setRecruit] = useState<Recruit | null>(null);
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
    if (!id) return navigate('/recruits', { replace: true });

    axios.get(`/api/recruits/${id}`)
      .then(res => {
        setRecruit(res.data);
      })
      .catch(() => {
        toast.error('채용 정보를 불러오지 못했습니다.');
        navigate('/recruits', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleApply = () => {
    const email = getEmail();
    if (!email) {
      toast.error('로그인 후 지원해주세요.');
      navigate('/login');
      return;
    }
    axios.post(`/api/recruits/${id}/apply`, {}, { params: { email } })
      .then(() => toast.success('지원이 완료되었습니다!'))
      .catch(err => {
        if (err.response?.status === 409) {
          toast.info('이미 지원하셨습니다.');
        } else {
          toast.error('지원 중 오류 발생.');
        }
      });
  };

  if (loading) return <p className="rd-loading">로딩 중…</p>;
  if (!recruit) return <p className="rd-not-found">해당 채용을 찾을 수 없습니다.</p>;

  return (
    <div className="rd-wrapper">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <div className="rd-card">
        {recruit.imageUrl && (
          <div className="rd-image-wrap">
            <img
              src={`/api/proxy/image?url=${encodeURIComponent(recruit.imageUrl)}`}
              alt={recruit.title}
              className="rd-image"
            />
          </div>
        )}

        <h2 className="rd-title">{recruit.title}</h2>
        <p className="rd-content">{recruit.content}</p>

        <div className="rd-meta">
          <span className="rd-views">조회수: {recruit.viewCount}</span>
        </div>

        <div className="rd-actions">
          <button className="rd-apply-btn" onClick={handleApply}>지원하기</button>
        </div>

        <Link to="/recruits" className="rd-back">← 목록으로 돌아가기</Link>
      </div>
    </div>
  );
}
