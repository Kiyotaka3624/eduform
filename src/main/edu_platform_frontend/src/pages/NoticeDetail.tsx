import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './NoticeDetail.css';

interface Notice {
  [key: string]: string;
}

const NoticeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    fetch('/notices.xlsx')
      .then(res => res.arrayBuffer())
      .then(buf => {
        const wb = XLSX.read(buf, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const [cols, ...rows] = data;
        const items: Notice[] = rows.map(row => {
          const obj: Notice = {};
          cols.forEach((col: string, idx: number) => {
            obj[col] = row[idx] || '';
          });
          return obj;
        });
        const saved: Notice[] = JSON.parse(localStorage.getItem('notices') || '[]');
        const all = [...items, ...saved];
        const idxNum = Number(id);
        setNotice(all[idxNum] || null);
      })
      .catch(err => console.error('공지 상세 로드 실패:', err));
  }, [id]);

  if (!notice) {
    return <p className="nd-loading">해당 공지를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="notice-detail">
      <h2 className="nd-title">{notice['제목']}</h2>
      {notice['부제목'] && <h4 className="nd-subtitle">{notice['부제목']}</h4>}
      <div className="nd-content">{notice['내용']}</div>
      <Link to="/notices" className="nd-back">← 목록으로 돌아가기</Link>
    </div>
  );
};

export default NoticeDetail;
