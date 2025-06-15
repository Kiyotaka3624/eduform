import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NoticeBoard from './pages/NoticeBoard';
import NoticeAdd from './pages/NoticeAdd';
import NoticeDetail from './pages/NoticeDetail';
import LectureList from './pages/LectureBoard';
import LectureAdd from './pages/LectureAdd';
import LectureDetail from './pages/LectureDetail';
import TrainingBoard from './pages/TrainingBoard';
import TrainingAdd   from './pages/TrainingAdd';
import TrainingDetail from './pages/TrainingDetail';
import RecruitAdd from './pages/RecruitAdd';
import RecruitBoard from './pages/RecruitBoard';
import RecruitDetail from './pages/RecruitDetail';
import QnaBoard from './pages/QnaBoard';
import QnaAdd from './pages/QnaAdd';
import LoginLog from './pages/LoginLog';
import './App.css';

export default function App() {
  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/notices" element={<NoticeBoard />} />
          <Route path="/notices/add" element={<NoticeAdd />} />
          <Route path="/notices/:id" element={<NoticeDetail />} />

          {/* Lecture routes */}
          <Route path="/lectures" element={<LectureList />} />
          <Route path="/lectures/add" element={<LectureAdd />} />
          <Route path="/lectures/:id" element={<LectureDetail />} />

          {/* 추가적인 라우트가 필요하면 여기에 작성하세요 */}
          <Route path="/trainings" element={<TrainingBoard />} />
          <Route path="/trainings/add" element={<TrainingAdd />} />
          <Route path="/trainings/:id" element={<TrainingDetail />} />

          <Route path="/recruits" element={<RecruitBoard />} />
          <Route path="/recruits/add" element={<RecruitAdd />} />
          <Route path="/recruits/:id" element={<RecruitDetail />} />

          <Route path="/qna" element={<QnaBoard />} />
          <Route path="/qna/ask" element={<QnaAdd />} />

          <Route path="/admin/log" element={<LoginLog />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
