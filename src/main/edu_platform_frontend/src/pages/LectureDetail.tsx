// src/pages/LectureDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import * as XLSX from "xlsx";
import "./LectureDetail.css";

interface Lecture {
  [key: string]: string;
}

const toEmbedUrl = (url: string) => {
  // blob: URLs (uploaded files) stay as-is
  if (url.startsWith("blob:")) return url;

  // youtu.be short link
  let m = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;

  // regular watch URL
  m = url.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;

  // embed URL already?
  if (url.includes("youtube.com/embed/")) return url;

  // otherwise just return original
  return url;
};

const LectureDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lecture, setLecture] = useState<Lecture | null>(null);

  useEffect(() => {
    fetch("/lectures.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buf) => {
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const [cols, ...rows] = data;
        const fromExcel = rows.map((row) => {
          const obj: Lecture = {};
          cols.forEach((col: string, idx: number) => {
            obj[col] = row[idx] || "";
          });
          return obj;
        });

        const fromStorage: Lecture[] = JSON.parse(
          localStorage.getItem("lectures") || "[]"
        );
        const all = [...fromExcel, ...fromStorage];
        setLecture(all[Number(id)] || null);
      })
      .catch((err) => console.error("강의 상세 로드 실패:", err));
  }, [id]);

  if (!lecture) {
    return <p className="ld-loading">해당 강의를 찾을 수 없습니다.</p>;
  }

  const videoSrc = toEmbedUrl(lecture["동영상"]);

  return (
    <div className="lecture-detail-wrapper">
      <div className="lecture-detail-card">
        <header className="ld-header">
          <h2 className="ld-title">{lecture["제목"]}</h2>
          {lecture["부제목"] && (
            <p className="ld-subtitle">{lecture["부제목"]}</p>
          )}
        </header>

        <div className="ld-body">
          {lecture["썸네일"] && (
            <img
              src={lecture["썸네일"]}
              alt="썸네일"
              className="ld-thumbnail"
            />
          )}

          <p className="ld-description">{lecture["설명"]}</p>

          <div className="ld-video-container">
            {videoSrc.startsWith("blob:") ? (
              <video controls src={videoSrc} className="ld-video" />
            ) : (
              <iframe
                className="ld-video"
                src={videoSrc}
                title={lecture["제목"]}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>

        <footer className="ld-footer">
          <Link to="/lectures" className="ld-back">
            ← 강의 목록으로 돌아가기
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default LectureDetail;
