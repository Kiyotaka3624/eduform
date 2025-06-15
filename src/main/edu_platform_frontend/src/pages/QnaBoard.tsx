import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './QnaBoard.css';

export default function QnaBoard() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/qna/questions')
      .then(res => {
        console.log('받은 데이터:', res.data);
        setQuestions(res.data);
      })
      .catch(err => {
        console.error('에러 발생:', err);
      });
  }, []);

  const handleView = (qId) => {
    navigate(`/qna/${qId}`);
  };

  const handleAsk = () => {
    navigate('/qna/ask');
  }

  return (
    <div className="qna-container">
      <div className="qna-header">
        <h1>Q&A 게시판</h1>
        <button onClick={handleAsk} className="ask-button">질문하기</button>
      </div>

      <table className="qna-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, index) => (
            <tr key={q.qid} onClick={() => handleView(q.qid)} className="qna-row">
              <td>{index + 1}</td>
              <td>{q.title}</td>
              <td>{q.userName}</td>
              <td>{new Date(q.createdAt).toLocaleDateString()}</td>
              <td>{q.viewCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
