// src/pages/Home.tsx (또는 원하는 경로에 저장)
import "../../styles/list.scss";
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
    <>
      <div className="list-container-wrap">
        <div className="top-container-wrap">
          <div className="top-container-left">
            <div className="top-container-left-left">
              <div>
                교육청 : <input type="text" />
              </div>
              <div>
                학교명 : <input type="text" />
              </div>
              <div>
                이름 : <input type="text" />
              </div>

              <div>
                <button>검색 </button>
              </div>
              <div>
                <p>학교명 : </p>
                <p>영문학교명 : </p>
                <p>홈페이지 : </p>
                <p>주소 : </p>
                <p>우편 : </p>
                <p>팩스 : </p>
              </div>
            </div>
            <div className="top-container-left-right">
              <p>학생 증명사진</p>
            </div>
          </div>
          <div className="top-container-right">
            <div>신규등록</div>
            <div>신규등록</div>
            <div>신규등록</div>
            <div>신규등록</div>
            <div>신규등록</div>
          </div>
        </div>
        <div className="bottom-container-wrap">
          <div>
            학번 : <input type="text" />
          </div>
          <div>
            학번 : <input type="text" />
          </div>
          <div>
            학번 : <input type="text" />
          </div>
          <div>
            학번 : <input type="text" />
          </div>
          <div>
            학번 : <input type="text" />
          </div>
          <div>
            학번 : <input type="text" />
          </div>
          <div>
            학번 : <input type="text" />
          </div>
          <div>
            학번 : <input type="text" />
          </div>
          <div>
            학번 : <input type="text" />
          </div>
          <div>
            학번 : <input type="text" />
          </div>
          <div>
            학번 : <input type="text" />
          </div>
          <div>
            학번 : <input type="text" />
          </div>
          <div>
            학번 : <input type="text" />
          </div>
          <div>
            학번 : <input type="text" />
          </div>
          <div>
            학번 : <input type="text" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
