import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './LectureBoard.css';

interface Lecture {
  [key: string]: string;
}

export default function LectureBoard() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // JWT에서 role 파싱
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { role: r } = JSON.parse(atob(token.split('.')[1]));
        setRole(r);
      } catch {
        localStorage.removeItem('token');
      }
    }

    // 엑셀 파일 + localStorage lectures 합치기
    fetch('/lectures.xlsx')
      .then(res => res.arrayBuffer())
      .then(buf => {
        const wb = XLSX.read(buf, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const [cols, ...rows] = data;
        const fromExcel: Lecture[] = rows.map(row => {
          const obj: Lecture = {};
          cols.forEach((c: string, i: number) => {
            obj[c] = row[i] || '';
          });
          return obj;
        });

        const stored: Lecture[] = JSON.parse(localStorage.getItem('lectures') || '[]');
        setLectures([...fromExcel, ...stored]);
      })
      .catch(err => console.error('강의 로드 실패:', err));
  }, []);

  return (
    <div className="lecture-board">
      <h2 className="lb-heading">강의 목록</h2>

      {(role === 'ADMIN' || role === 'PROFESSOR') && (
        <button
          className="lb-add-btn"
          onClick={() => navigate('/lectures/add')}
        >
          강의 추가하기
        </button>
      )}

      <div className="lb-list">
        {lectures.map((lec, idx) => (
          <Link to={`/lectures/${idx}`} key={idx} className="lb-item">
            {lec['썸네일'] && (
              <img
                src={lec['썸네일']}
                alt={lec['제목']}
                className="lb-thumb"
              />
            )}
            <div className="lb-info">
              <h3>{lec['제목']}</h3>
              {lec['부제목'] && <p>{lec['부제목']}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
