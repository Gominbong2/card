// src/api/school.ts (API 호출 로직 및 타입 정의 파일)

import axios from "axios"; // HTTP 요청을 위한 axios 라이브러리 임포트

// --- 1. 상수 정의 ---
const BASE_URL = "https://open.neis.go.kr/hub/schoolInfo"; // 나이스 교육정보 개방 포털 학교 정보 API의 기본 URL
const API_KEY = "e82ebfed90494edc9d46011e72e0c2b8"; // ✨ 여기에 발급받은 실제 API 키를 사용하세요!
// (보안을 위해 실제 프로젝트에서는 환경 변수로 관리하는 것이 좋습니다.)

// --- 2. 타입 정의 ---

// 나이스 API 응답 중 'RESULT' 객체의 구조를 정의하는 인터페이스
interface NeisApiResult {
  CODE: string; // API 응답 결과 코드 (예: "INFO-000" - 데이터 없음, "ERROR-300" - 서비스 에러 등)
  MESSAGE: string; // API 응답 결과 메시지
}

// 나이스 API의 전체 응답 구조를 정의하는 인터페이스
// 'schoolInfo' 키는 선택적이며, 있을 경우 특정 배열 형태를 가집니다.
// 'RESULT' 키 또한 선택적이며, 있을 경우 NeisApiResult 타입을 가집니다.
interface NeisApiResponse {
  schoolInfo?: [
    // 학교 정보 데이터가 담기는 최상위 배열 (선택적)
    { head?: any[] }, // 배열의 첫 번째 요소는 'head' 정보 (API 호출 결과 메타데이터, 필요 시 상세 타입 정의)
    { row: SchoolInfoRow[] } // 배열의 두 번째 요소는 실제 학교 정보 데이터(SchoolInfoRow 객체들의 배열)
  ];
  RESULT?: NeisApiResult; // API 호출의 성공/실패 및 상세 메시지를 담는 객체
  [key: string]: any; // 위에서 명시되지 않은 다른 최상위 키들도 허용 (API 응답 유연성 확보)
}

// 개별 학교 정보의 상세 데이터 필드를 정의하는 인터페이스
// 이 타입은 'List.tsx'와 같은 다른 파일에서 사용할 것이므로 'export' 키워드를 붙입니다.
export interface SchoolInfoRow {
  ATPT_OFCDC_SC_CODE: string; // 시도교육청코드 (예: "B10" - 서울특별시교육청)
  ATPT_OFCDC_SC_NM: string; // 시도교육청명 (예: "서울특별시교육청")
  SD_SCHUL_CODE: string; // 표준학교코드 (각 학교를 고유하게 식별하는 코드)
  SCHUL_NM: string; // 학교명 (예: "서울중원초등학교")
  ENG_SCHUL_NM: string; // 영문학교명
  SCHUL_KND_SC_NM: string; // 학교종류명 (예: "초등학교", "중학교", "고등학교")
  LCTN_SC_NM: string; // 소재지명 (학교가 위치한 지역의 이름)
  JU_ORG_NM: string; // 관할조직명 (학교를 관할하는 상위 조직명)
  FOND_SC_NM: string; // 설립구분명 (예: "공립", "사립")
  ORG_RDNZC: string; // 도로명우편번호
  ORG_RDNMA: string; // 도로명주소
  ORG_RDNMA_ADDR: string; // 도로명상세주소
  ORG_TELNO: string; // 전화번호
  HMPG_ADRES: string; // 홈페이지 주소
  FAXNO: string; // 팩스번호
  DGHT_SC_NM: string; // 주야구분명 (예: "주간")
  FOUND_YMD: string; // 설립인가일자 (YYYYMMDD 형식)
  FOAS_MEMO: string; // 개교기념일
  LOAD_DTM: string; // 최종 데이터 수정일 (YYYYMMDD 형식)
}

// API 요청 시 사용할 쿼리 파라미터에 대한 인터페이스
// 이 타입 또한 'List.tsx'에서 사용할 수 있도록 'export' 키워드를 붙입니다.
export interface SchoolSearchParams {
  ATPT_OFCDC_SC_CODE?: string;
  SD_SCHUL_CODE?: string; // 표준학교코드 (선택적 검색 조건)
  SCHUL_NM?: string; // 학교명 (선택적 검색 조건)
  ENG_SCHUL_NM?: string; // 영문학교명 (선택적 검색 조건)
  ESTBL_SC_NM?: string; // 설립구분명 (예: "공립", "사립" - 선택적 검색 조건)
  pIndex?: number; // 페이지 번호 (선택적, API 기본값은 1)
  pSize?: number; // 한 페이지 결과 건수 (선택적, API 기본값은 100)
}

// --- 3. API 요청 함수 ---

/**
 * 나이스 교육정보 개방 포털에서 서울특별시의 학교 정보를 비동기로 검색합니다.
 * 이 함수는 데이터를 직접 반환하며, 콘솔 출력은 디버깅 목적으로만 사용됩니다.
 *
 * @param {SchoolSearchParams} searchConditions - 학교명, 페이지 번호 등 검색 조건을 담은 객체.
 * 시도교육청 코드는 이 함수 내부에서 서울특별시("B10")로 고정됩니다.
 * @returns {Promise<SchoolInfoRow[]>} 검색된 학교 정보 배열을 Promise로 반환합니다.
 * 검색 결과가 없거나 API 오류가 발생하면 빈 배열 또는 에러를 발생시킵니다.
 * @throws {Error} API 호출 또는 응답 처리 중 문제가 발생하면 에러를 발생시킵니다.
 */
export async function fetchSchoolInfo( // 외부에서 임포트하여 사용할 수 있도록 'export' 키워드 사용
  searchConditions: SchoolSearchParams
): Promise<SchoolInfoRow[]> {
  // searchConditions 객체에서 pIndex와 pSize를 추출하고, 나머지는 otherConditions에 담습니다.
  const { pIndex = 1, pSize = 100, ...otherConditions } = searchConditions;

  // const SEOUL_CITY_CODE = "B10"; // 서울특별시교육청 코드 (하드코딩)

  // API 요청에 필요한 쿼리 파라미터 객체를 구성합니다.
  const queryParams = {
    KEY: API_KEY, // 발급받은 인증키
    Type: "json", // 응답 데이터 형식 (JSON으로 고정)
    pIndex: pIndex.toString(), // 페이지 번호 (문자열로 변환)
    pSize: pSize.toString(), // 한 페이지 결과 건수 (문자열로 변환)
    // 서울특별시 코드로 고정된 시도교육청 코드
    ...otherConditions, // 학교명(SCHUL_NM) 등 그 외의 검색 조건들
  };

  try {
    // 디버깅 목적으로 API 요청 URL을 콘솔에 출력합니다.
    console.log(
      `\n[school.ts] API 요청 URL: ${BASE_URL}?${new URLSearchParams(
        queryParams as Record<string, string> // 쿼리 파라미터를 URLSearchParams 형식으로 변환
      ).toString()}`
    );

    // Axios를 사용하여 GET 요청을 보냅니다. 응답 데이터의 타입을 NeisApiResponse로 명시합니다.
    const response = await axios.get<NeisApiResponse>(BASE_URL, {
      params: queryParams, // 구성된 쿼리 파라미터 전달
    });
    const data = response.data; // Axios는 응답 데이터를 response.data에 제공합니다.

    // --- 4. 응답 처리 및 데이터 반환 ---

    // 나이스 API 응답 구조를 확인하고 실제 학교 정보(row)를 반환합니다.
    // 응답은 'schoolInfo': [ { head: [...] }, { row: [...] } ] 형태일 가능성이 높습니다.
    if (
      "schoolInfo" in data && // 'schoolInfo' 키가 존재하는지
      Array.isArray(data.schoolInfo) && // 'schoolInfo'가 배열인지
      data.schoolInfo.length > 1 && // 배열 길이가 1보다 큰지 (head와 row를 모두 포함하는지)
      typeof data.schoolInfo[1] === "object" && // 두 번째 요소가 객체인지
      data.schoolInfo[1] !== null && // 두 번째 요소가 null이 아닌지
      "row" in data.schoolInfo[1] && // 두 번째 요소에 'row' 키가 존재하는지
      Array.isArray(data.schoolInfo[1].row) // 'row'가 배열인지
    ) {
      const schools = data.schoolInfo[1].row as SchoolInfoRow[]; // 실제 학교 정보 배열을 추출
      // 가져온 학교 데이터 배열을 콘솔에 출력 (디버깅 용이)
      console.log("[school.ts] API 응답 데이터:", schools);
      return schools; // 학교 정보 배열을 반환합니다.
    }
    // API 응답에 에러 정보('RESULT')가 포함된 경우를 처리합니다.
    else if (
      "RESULT" in data && // 'RESULT' 키가 존재하는지
      typeof data.RESULT === "object" && // 'RESULT'가 객체인지
      data.RESULT !== null && // 'RESULT'가 null이 아닌지
      "CODE" in data.RESULT && // 'RESULT' 객체에 'CODE' 키가 있는지
      "MESSAGE" in data.RESULT // 'RESULT' 객체에 'MESSAGE' 키가 있는지
    ) {
      // 'INFO-000' 코드는 "정상 처리되었으나, 요청한 데이터가 없음"을 의미합니다.
      if (data.RESULT.CODE === "INFO-000") {
        console.log(`[school.ts] API 응답: 데이터 없음 (${data.RESULT.CODE})`);
        return []; // 이 경우, 검색 결과가 없으므로 빈 배열을 반환합니다.
      }
      // 그 외의 API 오류 코드에 대해서는 에러를 발생시킵니다.
      console.error(
        `[school.ts] API 오류 (${data.RESULT.CODE}): ${data.RESULT.MESSAGE}`
      );
      throw new Error(`API 오류 (${data.RESULT.CODE}): ${data.RESULT.MESSAGE}`);
    }
    // 위 조건들에 해당하지 않는 예상치 못한 응답 형태이거나 데이터가 없는 경우를 처리합니다.
    else {
      console.warn(
        "[school.ts] 예상치 못한 API 응답 구조:",
        JSON.stringify(data, null, 2)
      );
      return []; // 빈 배열 반환
    }
  } catch (error: unknown) {
    // Axios 또는 네트워크 관련 에러 처리
    if (axios.isAxiosError(error)) {
      // Axios 에러 객체인지 확인
      if (error.response) {
        // 서버가 응답했으나 2xx 범위 밖의 상태 코드를 반환한 경우
        console.error(
          "[school.ts] 서버 응답 오류 (HTTP Status:",
          error.response.status,
          "):",
          error.response.data
        );
      } else if (error.request) {
        // 요청이 전송되었으나 응답을 받지 못한 경우 (네트워크 끊김 등)
        console.error(
          "[school.ts] 요청을 보냈으나 응답을 받지 못했습니다:",
          error.request
        );
      } else {
        // 요청 설정 중에 문제가 발생한 경우 (예: 잘못된 URL)
        console.error("[school.ts] 요청 설정 중 오류:", error.message);
      }
      throw new Error(`API 호출 중 오류 발생: ${error.message}`);
    } else if (error instanceof Error) {
      // 일반 JavaScript Error 인스턴스인 경우
      console.error("[school.ts] 알 수 없는 오류 발생:", error.message);
      throw error;
    } else {
      // 그 외 알 수 없는 타입의 오류 (예상치 못한 경우)
      console.error("[school.ts] 예상치 못한 타입의 오류 발생");
      throw new Error("알 수 없는 오류가 발생했습니다.");
    }
  }
}

// 이 파일은 React 컴포넌트에서 임포트하여 사용하는 모듈(함수 라이브러리)이므로,
// 파일 로드 시 자동으로 실행되는 최하단의 즉시 실행 함수는 필요 없습니다.
// (async () => { /* ... */ })(); 형태의 코드는 제거됩니다.
