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

  return (
    <>
      <div className="list-container">
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
                  <p>학교명 : 중원초등학교</p>
                  <p>영문학교명 : Seoul Jungwon EI </p>
                  <p>홈페이지 : www.jungwon.es.kr </p>
                  <p>주소 : 서울특별시 노원구 섬밭로 316 </p>
                  <p>우편 : 1777</p>
                  <p>팩스 : 02-971-4775</p>
                </div>
              </div>
              <div className="top-container-left-right">
                <div>
                  학교코드 : <input type="text" />
                </div>
                <div>
                  학교명 : <input type="text" />
                </div>
                <div>
                  학생이름 : <input type="text" />
                </div>
                <div>
                  학생생일 : <input type="text" />
                </div>
                <div>
                  재적상태 : <input type="text" />
                </div>
                <div>
                  학생주소 : <input type="text" />
                </div>
              </div>
            </div>
            <div className="top-container-right">
              <div>신규등록</div>
              <div>
                학교명 : <input type="text" />
              </div>
              <div>
                학생명 : <input type="text" />
              </div>
              <div>
                생년월일 : <input type="text" />
              </div>
              <div>
                성별 : <input type="text" />
              </div>
              <div>
                주소 : <input type="text" />
              </div>
              <div>
                학생사진 : <input type="text" />
              </div>
              <div>
                <button>등록</button>
              </div>
            </div>
          </div>
          <div className="bottom-container-wrap">
            <table className="school-table">
              <thead>
                <tr>
                  <th>학교명</th>
                  <th>학생이름</th>
                  <th>생년월일</th>
                  <th>성별</th>
                  <th>주소</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>중원초등학교</td>
                  <td>홍길동</td>
                  <td>2025-01-01</td>
                  <td>남자</td>
                  <td>서울시 노원구 중계동 나머지주소 000동 0000호 </td>
                </tr>
                <tr>
                  <td>중원초등학교</td>
                  <td>고길동</td>
                  <td>2025-01-01</td>
                  <td>남자</td>
                  <td>서울시 노원구 중계동 나머지주소 000동 0000호 </td>
                </tr>
                <tr>
                  <td>중원초등학교</td>
                  <td>고길동</td>
                  <td>2025-01-01</td>
                  <td>남자</td>
                  <td>서울시 노원구 중계동 나머지주소 000동 0000호 </td>
                </tr>
                <tr>
                  <td>중원초등학교</td>
                  <td>고길동</td>
                  <td>2025-01-01</td>
                  <td>남자</td>
                  <td>서울시 노원구 중계동 나머지주소 000동 0000호 </td>
                </tr>
                <tr>
                  <td>중원초등학교</td>
                  <td>고길동</td>
                  <td>2025-01-01</td>
                  <td>남자</td>
                  <td>서울시 노원구 중계동 나머지주소 000동 0000호 </td>
                </tr>
                <tr>
                  <td>중원초등학교</td>
                  <td>고길동</td>
                  <td>2025-01-01</td>
                  <td>남자</td>
                  <td>서울시 노원구 중계동 나머지주소 000동 0000호 </td>
                </tr>
                <tr>
                  <td>중원초등학교</td>
                  <td>고길동</td>
                  <td>2025-01-01</td>
                  <td>남자</td>
                  <td>서울시 노원구 중계동 나머지주소 000동 0000호 </td>
                </tr>
                <tr>
                  <td>중원초등학교</td>
                  <td>고길동</td>
                  <td>2025-01-01</td>
                  <td>남자</td>
                  <td>서울시 노원구 중계동 나머지주소 000동 0000호 </td>
                </tr>
                <tr>
                  <td>중원초등학교</td>
                  <td>고길동</td>
                  <td>2025-01-01</td>
                  <td>남자</td>
                  <td>서울시 노원구 중계동 나머지주소 000동 0000호 </td>
                </tr>
                <tr>
                  <td>중원초등학교</td>
                  <td>고길동</td>
                  <td>2025-01-01</td>
                  <td>남자</td>
                  <td>서울시 노원구 중계동 나머지주소 000동 0000호 </td>
                </tr>
                <tr>
                  <td>중원초등학교</td>
                  <td>고길동</td>
                  <td>2025-01-01</td>
                  <td>남자</td>
                  <td>서울시 노원구 중계동 나머지주소 000동 0000호 </td>
                </tr>
                <tr>
                  <td>중원초등학교</td>
                  <td>고길동</td>
                  <td>2025-01-01</td>
                  <td>남자</td>
                  <td>서울시 노원구 중계동 나머지주소 000동 0000호 </td>
                </tr>
                <tr>
                  <td>중원초등학교</td>
                  <td>고길동</td>
                  <td>2025-01-01</td>
                  <td>남자</td>
                  <td>서울시 노원구 중계동 나머지주소 000동 0000호 </td>
                </tr>
                <tr>
                  <td>중원초등학교</td>
                  <td>고길동</td>
                  <td>2025-01-01</td>
                  <td>남자</td>
                  <td>서울시 노원구 중계동 나머지주소 000동 0000호 </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
