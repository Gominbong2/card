// src/pages/Home.tsx (또는 원하는 경로에 저장)

import React, { useState, useEffect } from "react";
import { fetchSchoolInfo, SchoolInfoRow } from "../api/school"; // school.ts 파일에서 함수와 타입을 임포트

function Home() {
  const [schools, setSchools] = useState<SchoolInfoRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSchoolData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 서울특별시의 "중원초등학교"를 하드코딩하여 검색합니다.
        const results = await fetchSchoolInfo({
          SCHUL_NM: "중원초등학교", // 검색할 학교명
          pSize: 1, // 중원초등학교 하나만 찾을 것이므로 페이지 크기를 1로 설정
        });
        setSchools(results);

        // 콘솔에 결과 출력
        console.log("\n--- Home.tsx에서 API 호출 결과 ---");
        if (results.length > 0) {
          results.forEach((school, index) => {
            console.log(`\n[${index + 1}]`);
            console.log(`  학교명: ${school.SCHUL_NM}`);
            console.log(`  시도교육청: ${school.ATPT_OFCDC_SC_NM}`);
            console.log(`  학교종류: ${school.SCHUL_KND_SC_NM}`);
            console.log(`  주소: ${school.ORG_RDNMA} ${school.ORG_RDNMA_ADDR}`);
            if (school.ORG_TELNO) console.log(`  전화: ${school.ORG_TELNO}`);
            if (school.HP_ADDR) console.log(`  홈페이지: ${school.HP_ADDR}`);
          });
        } else {
          console.log("검색된 학교가 없습니다.");
        }
        console.log("---------------------------------\n");
      } catch (err: any) {
        setError(err.message || "알 수 없는 검색 오류");
        console.error("Home 컴포넌트에서 학교 검색 중 오류 발생:", err);
      } finally {
        setLoading(false);
      }
    };

    getSchoolData();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // HTML 요소는 지워달라고 하셨지만, 최소한의 정보는 화면에 표시하는 것이
  // 디버깅 및 사용자 경험에 도움이 되므로 간단하게 구성했습니다.
  // 원하시면 return 내부의 JSX를 모두 제거하고 빈 div만 남겨도 됩니다.
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333" }}>학교 정보 페이지</h1>
      <p style={{ textAlign: "center", color: "#666" }}>
        콘솔을 열어 "중원초등학교" 검색 결과를 확인하세요.
      </p>

      {loading && (
        <p style={{ textAlign: "center", color: "#666" }}>
          학교 정보를 불러오는 중입니다...
        </p>
      )}

      {error && (
        <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>
          오류: {error}
        </p>
      )}

      {!loading && !error && schools.length === 0 && (
        <p style={{ textAlign: "center", color: "#666" }}>
          검색 결과가 없습니다.
        </p>
      )}

      {schools.length > 0 && (
        <div>
          <h2 style={{ textAlign: "center", color: "#333" }}>
            검색된 학교 ({schools.length}개)
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {schools.map((school) => (
              <li
                key={school.SD_SCHUL_CODE}
                style={{
                  marginBottom: "15px",
                  padding: "15px",
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <strong style={{ fontSize: "1.1em", color: "#0056b3" }}>
                  {school.SCHUL_NM}
                </strong>{" "}
                ({school.ATPT_OFCDC_SC_NM} - {school.SCHUL_KND_SC_NM})
                <p
                  style={{ fontSize: "0.9em", color: "#555", margin: "5px 0" }}
                >
                  주소: {school.ORG_RDNMA} {school.ORG_RDNMA_ADDR}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Home;
