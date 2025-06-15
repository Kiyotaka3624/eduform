import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LoginLog.css';

interface Log {
  logId: number;
  loginTime: string;
  ipAddress: string;
  userAgent: string;
  userName: string;
  email: string;
}

export default function LoginLog(): JSX.Element {
  const [logs, setLogs] = useState<Log[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/api/admin/login-logs')
      .then(res => {
        console.log('로그인 기록 응답:', res.data);
        if (Array.isArray(res.data)) {
          setLogs(res.data);
        } else {
          setError('서버에서 잘못된 응답을 받았습니다.');
        }
      })
      .catch(err => {
        console.error('로그인 기록 로딩 실패:', err);
        setError('로그인 기록을 불러오는 중 오류 발생');
      });
  }, []);

  return (
    <div className="log-container">
      <h2>로그인 기록</h2>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table className="log-table">
          <thead>
            <tr>
              <th>로그 ID</th>
              <th>유저 이름</th>
              <th>이메일</th>
              <th>로그인 시각</th>
              <th>IP 주소</th>
              <th>브라우저 정보</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.logId}>
                <td>{log.logId}</td>
                <td>{log.userName}</td>
                <td>{log.email}</td>
                <td>{new Date(log.loginTime).toLocaleString()}</td>
                <td>{log.ipAddress}</td>
                <td>{log.userAgent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
