// src/pages/Home.tsx (또는 원하는 경로에 저장)
import "./list.scss";
import React, { useState, ChangeEvent } from "react";
import { fetchSchoolInfo, SchoolInfoRow } from "../api/school"; // school.ts 파일에서 함수와 타입을 임포트
import axios from "axios";
import Modal from "../modal/Modal";

interface FormData {
  schoolCode: string;
  schoolName: string;
  studentName: string;
  studentBirth: string;
  studentStatus: string;
  studentAddress: string;
}

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
  const [modalSearchValue, setModalSearchValue] = useState<string>("");
  const [schools, setSchools] = useState<SchoolInfoRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOfficeCode, setSelectedOfficeCode] = useState<string>("");
  const [addOfficeCode, setAddOfficeCode] = useState<string>("");
  const [schoolName, setSchoolName] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [studentList, setStudentList] = useState<studentList[]>([]);
  const [addStudentName, SetAddStudentName] = useState<string>("");
  const [modalSchoolNameInput, setModalSchoolNameInput] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [engSchoolName, setEngSchoolName] = useState<string>("");
  const [schoolCode, setSchoolCode] = useState<string>("");
  const [schoolZipCode, setSchoolZipCode] = useState<string>("");
  const [studentAddress, setStudentAddress] = useState<string>("");
  const [schoolAddress, setSchoolAddress] = useState<string>("");
  const [editFormData, setEditFormData] = useState<FormData>({
    schoolCode: "",
    schoolName: "",
    studentName: "",
    studentBirth: "",
    studentStatus: "",
    studentAddress: "",
  });

  // 새롭게 추가된 상태: 편집 모드 여부
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // 2. input type="date"의 onChange 이벤트 핸들러를 정의합니다.
  const handleBirthdateChange = (event: ChangeEvent<HTMLInputElement>) => {
    // 3. event.target.value는 YYYY-MM-DD 형식의 문자열입니다.
    setBirthDate(event.target.value);
  };

  // `selectedGender` state의 타입을 string으로 명확히 정의합니다.
  // 초기값은 'female'로 설정하여 '여성'이 기본 선택되도록 합니다.
  const [selectedGender, setSelectedGender] = useState<string>("");

  // `ChangeEvent<HTMLInputElement>` 타입을 사용하여 event 객체의 타입을 정의합니다.
  const handleGenderChange = (event: ChangeEvent<HTMLInputElement>) => {
    // `event.target.value`는 string 타입임을 타입스크립트가 알고 있습니다.
    setSelectedGender(event.target.value);
  };

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
      setStudentList(res.data.list);
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

  const handelAddStudentName = (event: ChangeEvent<HTMLInputElement>): void => {
    SetAddStudentName(event.target.value);
  };

  const modalSearchBtn = async (): Promise<void> => {
    try {
      console.log("모달에서 검색버튼 눌름");
      schoolSearchAPI();
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
      setModalSearchValue(event.target.value);
      console.log(event.target.value);
    } catch (err) {}
  };

  const handleStudentAddressChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setStudentAddress(event.target.value);
  };

  const schoolSearchAPI = async () => {
    try {
      const results = await fetchSchoolInfo({
        ATPT_OFCDC_SC_CODE: addOfficeCode,
        SCHUL_NM: modalSearchValue, // 검색할 학교명
        pSize: 100,
      });
      setSchools(results);

      // 콘솔에 결과 출력
      console.log("\n--- Home.tsx에서 API 호출 결과 ---");
      if (results.length > 0) {
        results.forEach((school, index) => {
          console.log(`\n[${index + 1}]`);
          console.log(`  학교명: ${school.SCHUL_NM}`);
          console.log(`  시도교육청: ${school.ATPT_OFCDC_SC_NM}`);
          console.log(`  코드: ${school.SD_SCHUL_CODE}`);
          console.log(`  학교종류: ${school.SCHUL_KND_SC_NM}`);
          console.log(`  주소: ${school.ORG_RDNMA} ${school.ORG_RDNMA_ADDR}`);
          console.log(`  우편번호: ${school.ORG_RDNZC}`);
          if (school.ORG_TELNO) console.log(`  전화: ${school.ORG_TELNO}`);
          if (school.HMPG_ADRES)
            console.log(`  홈페이지: ${school.HMPG_ADRES}`);
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

  const modalTableTrClick = (school: SchoolInfoRow) => {
    setModalSchoolNameInput(school.SCHUL_NM);
    setEngSchoolName(school.ENG_SCHUL_NM);
    setSchoolCode(school.SD_SCHUL_CODE);
    setSchoolZipCode(school.ORG_RDNZC);
    setSchoolAddress(school.ORG_RDNMA);
    setAddOfficeCode(school.ATPT_OFCDC_SC_CODE);
    handleCloseModal();
  };

  const addStudentClick = async () => {
    try {
      const data = {
        studentName: addStudentName,
        studentPhoto: "img",
        birthDate: birthDate,
        korName: modalSchoolNameInput,
        engName: engSchoolName,
        schoolCode: schoolCode,
        status: "재적",
        schoolZipCode: schoolZipCode,
        schoolAddress: schoolAddress,
        barcode: "BCM00000053",
        gender: selectedGender,
        studentAddress: studentAddress,
        officeCode: addOfficeCode,
      };

      console.log("생성된데이터 = ", data);
      // setFormData();
      const res = await axios.post(
        "http://localhost:8080/RestBoard/checkcard/api/add-member",
        data
      );

      if (res.status === 200) {
        // 또는 201 Created 등 성공 상태 코드 확인
        alert("학생 정보가 성공적으로 등록되었습니다!");
        // 각 상태를 초기값으로 리셋
        setAddOfficeCode(""); // 교육청 선택 초기화
        setModalSchoolNameInput(""); // 학교명 (모달에서 선택된) 초기화
        setEngSchoolName(""); // 영문 학교명 초기화
        setSchoolCode(""); // 학교 코드 초기화
        setSchoolZipCode(""); // 학교 우편번호 초기화
        setSchoolAddress(""); // 학교 주소 초기화
        SetAddStudentName(""); // 학생명 초기화
        setBirthDate(""); // 생년월일 초기화
        setSelectedGender(""); // 성별 초기화
        setStudentAddress(""); // 학생 주소 초기화
        // setStudentPhoto는 input type="file" 이므로 직접 초기화가 필요할 수 있습니다.
        // 또는 "img"와 같이 초기값이 고정된 경우 건드릴 필요 없습니다.

        // 검색 결과 목록도 새로고침하려면 handleSearchClick 호출
        // await handleSearchClick(null as any); // 인자 없는 경우 임시로 null as any (버튼 클릭 이벤트 핸들러가 아닐 경우)
        // 아니면 검색 조건 초기화 후 다시 검색 호출
      }
    } catch (err) {}
  };

  const studentListClick = (student: studentList) => {
    const data = {
      schoolCode: student.schoolCode,
      schoolName: student.schoolName,
      studentName: student.studentName,
      studentBirth: student.studentDateOfBirth,
      studentStatus: student.studentStatus,
      studentAddress: student.schoolAddress,
    };

    setEditFormData(data);
    // 학생 목록에서 항목을 클릭했을 때 편집 모드를 해제합니다.
    // 사용자가 다시 '수정' 버튼을 눌러야 편집 가능하도록 합니다.
    setIsEditing(false);
  };

  const handleEditFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData, // 기존 editFormData 상태를 그대로 복사
      [name]: value, // 변경된 input의 name 속성에 해당하는 필드만 value로 업데이트
    }));
  };

  // "수정" 버튼 클릭 시 편집 모드 활성화
  const handleEditClick = () => {
    setIsEditing(true);
    console.log("수정 모드 활성화");
  };

  // "저장" 버튼 클릭 시 (예시)
  const handleSaveClick = async () => {
    try {
      console.log("저장 클릭, 저장할 데이터:", editFormData);
      // 여기에 editFormData를 서버로 전송하는 API 호출 로직을 추가합니다.
      const res = await axios.post(
        "http://localhost:8080/RestBoard/checkcard/api/update",
        editFormData
      );
      alert("데이터가 저장되었습니다!");
      setIsEditing(false); // 저장 후 편집 모드 비활성화
    } catch (err) {
      console.error("데이터 저장 중 오류 발생:", err);
      alert("데이터 저장에 실패했습니다.");
    }
  };

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
                  학교코드 :{" "}
                  <input
                    type="text"
                    name="schoolCode"
                    readOnly={!isEditing} /* 편집 모드일 때만 편집 가능 */
                    value={editFormData.schoolCode}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div>
                  학교명 :{" "}
                  <input
                    type="text"
                    name="schoolName"
                    readOnly={!isEditing}
                    value={editFormData.schoolName}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div>
                  학생이름 :{" "}
                  <input
                    type="text"
                    name="studentName"
                    readOnly={!isEditing}
                    value={editFormData.studentName}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div>
                  학생생일 :{" "}
                  <input
                    type="text"
                    name="studentBirth"
                    readOnly={!isEditing}
                    value={editFormData.studentBirth}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div>
                  재적상태 :{" "}
                  <input
                    type="text"
                    name="studentStatus"
                    readOnly={!isEditing}
                    value={editFormData.studentStatus}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div>
                  학생주소 :{" "}
                  <input
                    type="text"
                    name="studentAddress"
                    readOnly={!isEditing}
                    value={editFormData.studentAddress}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="gird-binding">
                  <button onClick={handleEditClick}>수정 </button>
                  <button onClick={handleSaveClick}>저장 </button>
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
                    <button value={modalSearchValue} onClick={modalSearchBtn}>
                      검색
                    </button>
                  </div>
                  {/* 테이블 스크롤 영역 */}
                  <div className="modal-table-container">
                    <table className="modal-school-table">
                      <thead>
                        <tr>
                          <th>시도교육청</th>
                          <th>학교명</th>
                          <th>학교종류</th>
                          <th>주소</th>
                          <th>전화번호</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* schools 배열을 map으로 렌더링 */}
                        {schools.map((school, index) => (
                          <tr
                            key={index}
                            onClick={() => modalTableTrClick(school)}
                          >
                            {/* key는 고유해야 하며, 여기서는 index를 사용했지만 실제 데이터에는 고유 ID가 있다면 그것을 사용하세요. */}
                            <td>{school.ATPT_OFCDC_SC_NM}</td>
                            <td>{school.SCHUL_NM}</td>
                            <td>{school.SCHUL_KND_SC_NM}</td>
                            <td>
                              {school.ORG_RDNMA} {school.ORG_RDNMA_ADDR}
                            </td>
                            <td>{school.ORG_TELNO || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Modal>
              </div>
              <div className="3">
                학교명 :{" "}
                <input
                  type="text"
                  value={modalSchoolNameInput}
                  placeholder="검색하려면눌러주세요"
                  readOnly={true}
                  onClick={handleAddSearchClick}
                />
              </div>
              <div className="4">
                학생명 :{" "}
                <input
                  type="text"
                  onChange={handelAddStudentName}
                  value={addStudentName}
                />
              </div>
              <div className="5">
                생년월일 :{" "}
                <input
                  type="date"
                  value={birthDate}
                  onChange={handleBirthdateChange}
                />
              </div>
              <div className="6">
                성별 :{" "}
                <input
                  type="radio"
                  id="male"
                  name="gender" // 동일한 name으로 그룹화
                  value="M"
                  checked={selectedGender === "M"} // state 값과 일치하는지 확인하여 checked 상태 결정
                  onChange={handleGenderChange} // 변경 시 핸들러 호출
                />
                <label htmlFor="male">남성</label>
                {/* 여성 라디오 버튼 */}
                <input
                  type="radio"
                  id="female"
                  name="gender" // 동일한 name으로 그룹화
                  value="F"
                  checked={selectedGender === "F"} // state 값과 일치하는지 확인하여 checked 상태 결정
                  onChange={handleGenderChange} // 변경 시 핸들러 호출
                />
                <label htmlFor="female">여성</label>
              </div>
              <div className="7">
                주소 :{" "}
                <input
                  type="text"
                  onChange={handleStudentAddressChange}
                  value={studentAddress}
                />
              </div>
              <div className="8">
                학생사진 : <input type="text" />
              </div>
              <div className="9">
                <button onClick={addStudentClick}>등록</button>
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
                  {studentList.map((student, index) => (
                    <tr key={index} onClick={() => studentListClick(student)}>
                      {/* key는 고유해야 하며, 여기서는 index를 사용했지만 실제 데이터에는 고유 ID가 있다면 그것을 사용하세요. */}
                      <td>{student.schoolName}</td>
                      <td>{student.studentName}</td>
                      <td>{student.studentDateOfBirth}</td>
                      <td>{student.studentGender}</td>
                      <td>{student.schoolAddress}</td>
                    </tr>
                  ))}
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
