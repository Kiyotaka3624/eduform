import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './NoticeBoard.css';

interface Notice {
  [key: string]: string;
}

const NoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

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
        setNotices([...items, ...saved]);
      })
      .catch(err => console.error('공지 불러오기 실패:', err));
  }, []);

  return (
    <div className="notice-board">
      <div className="nb-header">
        <h2>📢 공지사항</h2>
        <Link to="/notices/add" className="nb-btn">공지 추가</Link>
      </div>
      <ul className="nb-list">
        {notices.map((notice, idx) => (
          <li key={idx} className="nb-item">
            <Link to={`/notices/${idx}`} className="nb-title-link">
              {notice['제목']}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoticeBoard;