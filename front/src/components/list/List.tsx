// src/pages/Home.tsx (또는 원하는 경로에 저장)
import "./list.scss";
import React, { useState, useEffect, ChangeEvent } from "react";
import { fetchSchoolInfo, SchoolInfoRow } from "../api/school"; // school.ts 파일에서 함수와 타입을 임포트
import axios from "axios";
import Modal from "../modal/Modal";

type studentList = {
  barcode: string;
  id: string;
  schoolAddress: string;
  schoolCode: string;
  schoolEnglishName: string;
  schoolName: string;
  schoolZipCode: string;
  studentDateOfBirth: string; // YYYY-MM-DD 형식의 문자열
  studentGender: "M" | "F"; // "M" 또는 "F"만 가능
  studentImg: string | null; // 이미지 URL이 문자열이거나 null일 수 있음
  studentName: string;
  studentStatus: string;
};

function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalSearchBtnValue, setModalSearchBtnValue] = useState<string>("");

  const [schools, setSchools] = useState<SchoolInfoRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedOfficeCode, setSelectedOfficeCode] = useState<string>("");
  const [addOfficeCode, setAddOfficeCode] = useState<string>("");
  const [schoolName, setSchoolName] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");

  const [studentList, setStudentList] = useState<studentList[]>([]);

  // 모달을 여는 함수 (onClick 이벤트 핸들러)
  const handleOpenModal = () => {
    setIsModalOpen(true); // isModalOpen 상태를 true로 변경하여 모달을 엽니다.
    console.log("모달 열기 버튼 클릭!");
  };
  // 모달을 닫는 함수 (Modal 컴포넌트에 prop으로 전달될 함수)
  const handleCloseModal = () => {
    setIsModalOpen(false); // isModalOpen 상태를 false로 변경하여 모달을 닫습니다.
    console.log("모달 닫기 요청!");
  };
  const handleOfficeChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedOfficeCode(event.target.value);
  };

  const handleSearchClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    try {
      console.log("검색클릭");
      const searchParams = { selectedOfficeCode, schoolName, studentName };
      const res = await axios.get(
        "http://localhost:8080/RestBoard/checkcard/api/list",
        { params: searchParams }
      );
      console.log(res.data);
      console.log(typeof res.data);
    } catch (err) {}
  };

  const handleAddSearchClick = async (
    event: React.MouseEvent<HTMLInputElement>
  ): Promise<void> => {
    try {
      event.preventDefault();
      if (addOfficeCode === "") {
        alert("교육청 필수 선택입니다.");
      } else {
        handleOpenModal();
      }
    } catch (err) {}
  };

  const handleAddClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    try {
      console.log("등록클릭");
    } catch (err) {}
  };

  const handleAddOfficeChange = (
    event: ChangeEvent<HTMLSelectElement>
  ): void => {
    setAddOfficeCode(event.target.value);
    console.log(event.target.value);
  };

  const modalSearchBtn = async (): Promise<void> => {
    try {
      console.log("모달에서 검색버튼 눌름");
    } catch (err) {}
  };

  const handleSchoolNameChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSchoolName(event.target.value);
  };

  const handleStudentNameChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setStudentName(event.target.value);
  };

  const modalSearchChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    try {
      setModalSearchBtnValue(event.target.value);
      console.log(event.target.value);
    } catch (err) {}
  };

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
                  교육청 :
                  <select
                    value={selectedOfficeCode}
                    onChange={handleOfficeChange}
                    className="select-box"
                  >
                    <option value="">-- 선택해주세요 --</option>
                    <option value="B10">서울특별시교육청</option>
                    <option value="C10">부산광역시교육청</option>
                    <option value="D10">대구광역시교육청</option>
                    <option value="E10">인천광역시교육청</option>
                    <option value="F10">광주광역시교육청</option>
                    <option value="G10">대전광역시교육청</option>
                    <option value="H10">울산광역시교육청</option>
                    <option value="I10">세종특별자치시교육청</option>
                    <option value="J10">경기도교육청</option>
                    <option value="K10">강원특별자치도교육청</option>
                    <option value="M10">충청북도교육청</option>
                    <option value="N10">충청남도교육청</option>
                    <option value="P10">전북특별자치도교육청</option>
                    <option value="Q10">전라남도교육청</option>
                    <option value="R10">경상북도교육청</option>
                    <option value="S10">경상남도교육청</option>
                    <option value="T10">제주특별자치도교육청</option>
                  </select>
                </div>
                <div>
                  학교명 :{" "}
                  <input type="text" onChange={handleSchoolNameChange} />
                </div>
                <div>
                  이름 :{" "}
                  <input type="text" onChange={handleStudentNameChange} />
                </div>
                <div>
                  <button onClick={handleSearchClick}>검색 </button>
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

                <div className="gird-binding">
                  <button>수정 </button>
                  <button>저장 </button>
                </div>
              </div>
            </div>
            <div className="top-container-right">
              <div className="1">신규등록</div>
              <div className="2">
                교육청 :
                <select
                  value={addOfficeCode}
                  onChange={handleAddOfficeChange}
                  className="select-box-2"
                  id="educationOffice"
                  name="sido_education_office"
                >
                  <option value="">-- 선택해주세요 --</option>
                  <option value="B10">서울특별시교육청</option>
                  <option value="C10">부산광역시교육청</option>
                  <option value="D10">대구광역시교육청</option>
                  <option value="E10">인천광역시교육청</option>
                  <option value="F10">광주광역시교육청</option>
                  <option value="G10">대전광역시교육청</option>
                  <option value="H10">울산광역시교육청</option>
                  <option value="I10">세종특별자치시교육청</option>
                  <option value="J10">경기도교육청</option>
                  <option value="K10">강원특별자치도교육청</option>
                  <option value="M10">충청북도교육청</option>
                  <option value="N10">충청남도교육청</option>
                  <option value="P10">전북특별자치도교육청</option>
                  <option value="Q10">전라남도교육청</option>
                  <option value="R10">경상북도교육청</option>
                  <option value="S10">경상남도교육청</option>
                  <option value="T10">제주특별자치도교육청</option>
                </select>
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                  {/* 모달 내부 검색창 영역 */}
                  <div className="modal-search-area">
                    학교 : <input onChange={modalSearchChange} type="text" />
                    <button
                      value={modalSearchBtnValue}
                      onClick={modalSearchBtn}
                    >
                      검색
                    </button>
                  </div>
                  {/* 테이블 스크롤 영역 */}
                  <div className="modal-table-container">
                    <table className="modal-school-table">
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
                        {/* 이 부분부터 스크롤됩니다. */}
                        <tr>
                          <td>중원초등학교</td>
                          <td>홍길동</td>
                          <td>2025-01-01</td>
                          <td>남자</td>
                          <td>
                            서울시 노원구 중계동 나머지주소 000동 0000ddddd호{" "}
                          </td>
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
                </Modal>
              </div>
              <div className="3">
                학교명 :{" "}
                <input
                  type="text"
                  placeholder="검색하려면눌러주세요"
                  readOnly={true}
                  onClick={handleAddSearchClick}
                />
              </div>
              <div className="4">
                학생명 : <input type="text" />
              </div>
              <div className="5">
                생년월일 : <input type="text" />
              </div>
              <div className="6">
                성별 : <input type="text" />
              </div>
              <div className="7">
                주소 : <input type="text" />
              </div>
              <div className="8">
                학생사진 : <input type="text" />
              </div>
              <div className="9">
                <button>등록</button>
              </div>
            </div>
          </div>
          <div className="bottom-container-wrap">
            <div>
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
      </div>
    </>
  );
}

export default Home;
