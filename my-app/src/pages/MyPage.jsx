import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import Goal from "./Goal";
import WeightChart from "../components/WeightChart";
import DailyRecordCard from "../components/DailyRecordCard";

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 더미 데이터 - 새 스키마에 맞춤
const DUMMY_USER = {
  member_id: 1,
  name: "김철수",
  student_no: "20210001",
  contact: "010-1234-5678",
  department: "체육학과",
  grade: 4,
  status: "재학",
  role_type: "GENERAL",
  matching_status: "INACTIVE",
  partner_id: null,
  total_points: 500,
  last_active_at: "2025-01-15T14:30:00",
  allow_push_notify: 1
};

// 운동 리스트 (ExerciseList) - 카테고리별 분류
const DUMMY_EXERCISE_LIST = [
  // 가슴 운동
  { exercise_id: 1, name: "벤치프레스", category: "가슴", calories_per_hour: 300, status: "APPROVED" },
  { exercise_id: 2, name: "인클라인 벤치프레스", category: "가슴", calories_per_hour: 310, status: "APPROVED" },
  { exercise_id: 3, name: "덤벨 플라이", category: "가슴", calories_per_hour: 280, status: "APPROVED" },
  { exercise_id: 4, name: "푸쉬업", category: "가슴", calories_per_hour: 250, status: "APPROVED" },
  { exercise_id: 5, name: "딥스", category: "가슴", calories_per_hour: 290, status: "APPROVED" },
  { exercise_id: 6, name: "케이블 크로스오버", category: "가슴", calories_per_hour: 270, status: "APPROVED" },

  // 등 운동
  { exercise_id: 7, name: "데드리프트", category: "등", calories_per_hour: 350, status: "APPROVED" },
  { exercise_id: 8, name: "풀업", category: "등", calories_per_hour: 280, status: "APPROVED" },
  { exercise_id: 9, name: "랫풀다운", category: "등", calories_per_hour: 260, status: "APPROVED" },
  { exercise_id: 10, name: "바벨 로우", category: "등", calories_per_hour: 320, status: "APPROVED" },
  { exercise_id: 11, name: "시티드 로우", category: "등", calories_per_hour: 270, status: "APPROVED" },
  { exercise_id: 12, name: "티바 로우", category: "등", calories_per_hour: 290, status: "APPROVED" },

  // 하체 운동
  { exercise_id: 13, name: "스쿼트", category: "하체", calories_per_hour: 400, status: "APPROVED" },
  { exercise_id: 14, name: "레그프레스", category: "하체", calories_per_hour: 320, status: "APPROVED" },
  { exercise_id: 15, name: "런지", category: "하체", calories_per_hour: 350, status: "APPROVED" },
  { exercise_id: 16, name: "레그 컬", category: "하체", calories_per_hour: 280, status: "APPROVED" },
  { exercise_id: 17, name: "레그 익스텐션", category: "하체", calories_per_hour: 270, status: "APPROVED" },
  { exercise_id: 18, name: "카프 레이즈", category: "하체", calories_per_hour: 200, status: "APPROVED" },

  // 어깨 운동
  { exercise_id: 19, name: "숄더 프레스", category: "어깨", calories_per_hour: 290, status: "APPROVED" },
  { exercise_id: 20, name: "사이드 레터럴 레이즈", category: "어깨", calories_per_hour: 240, status: "APPROVED" },
  { exercise_id: 21, name: "프론트 레이즈", category: "어깨", calories_per_hour: 230, status: "APPROVED" },
  { exercise_id: 22, name: "리어 델트 플라이", category: "어깨", calories_per_hour: 250, status: "APPROVED" },
  { exercise_id: 23, name: "업라이트 로우", category: "어깨", calories_per_hour: 270, status: "APPROVED" },

  // 팔 운동
  { exercise_id: 24, name: "바벨 컬", category: "팔", calories_per_hour: 220, status: "APPROVED" },
  { exercise_id: 25, name: "덤벨 컬", category: "팔", calories_per_hour: 210, status: "APPROVED" },
  { exercise_id: 26, name: "해머 컬", category: "팔", calories_per_hour: 215, status: "APPROVED" },
  { exercise_id: 27, name: "트라이셉스 익스텐션", category: "팔", calories_per_hour: 230, status: "APPROVED" },
  { exercise_id: 28, name: "트라이셉스 푸쉬다운", category: "팔", calories_per_hour: 225, status: "APPROVED" },

  // 복근 운동
  { exercise_id: 29, name: "크런치", category: "복근", calories_per_hour: 200, status: "APPROVED" },
  { exercise_id: 30, name: "플랭크", category: "복근", calories_per_hour: 180, status: "APPROVED" },
  { exercise_id: 31, name: "레그 레이즈", category: "복근", calories_per_hour: 210, status: "APPROVED" },
  { exercise_id: 32, name: "러시안 트위스트", category: "복근", calories_per_hour: 220, status: "APPROVED" },
  { exercise_id: 33, name: "마운틴 클라이머", category: "복근", calories_per_hour: 300, status: "APPROVED" },

  // 유산소 운동
  { exercise_id: 34, name: "런닝머신", category: "유산소", calories_per_hour: 500, status: "APPROVED" },
  { exercise_id: 35, name: "사이클", category: "유산소", calories_per_hour: 450, status: "APPROVED" },
  { exercise_id: 36, name: "일립티컬", category: "유산소", calories_per_hour: 420, status: "APPROVED" },
  { exercise_id: 37, name: "로잉머신", category: "유산소", calories_per_hour: 480, status: "APPROVED" },
  { exercise_id: 38, name: "스텝퍼", category: "유산소", calories_per_hour: 400, status: "APPROVED" },
  { exercise_id: 39, name: "줄넘기", category: "유산소", calories_per_hour: 600, status: "APPROVED" },
  { exercise_id: 40, name: "버피", category: "유산소", calories_per_hour: 550, status: "APPROVED" }
];

// 운동 로그 더미 데이터 (최근 30일)
const DUMMY_EXERCISE_LOGS = [
  // 1월 23일
  { exercise_log_id: 1, member_id: 1, exercise_id: 1, performed_at: "2025-01-23T10:00:00", exercise_name: "벤치프레스", duration_minutes: 30, achievement_id: null },
  { exercise_log_id: 2, member_id: 1, exercise_id: 13, performed_at: "2025-01-23T10:35:00", exercise_name: "스쿼트", duration_minutes: 25, achievement_id: null },
  { exercise_log_id: 3, member_id: 1, exercise_id: 34, performed_at: "2025-01-23T11:05:00", exercise_name: "런닝머신", duration_minutes: 20, achievement_id: null },

  // 1월 22일
  { exercise_log_id: 4, member_id: 1, exercise_id: 7, performed_at: "2025-01-22T14:00:00", exercise_name: "데드리프트", duration_minutes: 30, achievement_id: 1 },
  { exercise_log_id: 5, member_id: 1, exercise_id: 8, performed_at: "2025-01-22T14:35:00", exercise_name: "풀업", duration_minutes: 20, achievement_id: 1 },
  { exercise_log_id: 6, member_id: 1, exercise_id: 29, performed_at: "2025-01-22T15:00:00", exercise_name: "크런치", duration_minutes: 15, achievement_id: 1 },

  // 1월 21일
  { exercise_log_id: 7, member_id: 1, exercise_id: 19, performed_at: "2025-01-21T09:00:00", exercise_name: "숄더 프레스", duration_minutes: 25, achievement_id: 1 },
  { exercise_log_id: 8, member_id: 1, exercise_id: 24, performed_at: "2025-01-21T09:30:00", exercise_name: "바벨 컬", duration_minutes: 20, achievement_id: 1 },
  { exercise_log_id: 9, member_id: 1, exercise_id: 35, performed_at: "2025-01-21T10:00:00", exercise_name: "사이클", duration_minutes: 30, achievement_id: 1 },

  // 1월 20일
  { exercise_log_id: 10, member_id: 1, exercise_id: 1, performed_at: "2025-01-20T16:00:00", exercise_name: "벤치프레스", duration_minutes: 30, achievement_id: 2 },
  { exercise_log_id: 11, member_id: 1, exercise_id: 3, performed_at: "2025-01-20T16:35:00", exercise_name: "덤벨 플라이", duration_minutes: 20, achievement_id: 2 },
  { exercise_log_id: 12, member_id: 1, exercise_id: 30, performed_at: "2025-01-20T17:00:00", exercise_name: "플랭크", duration_minutes: 10, achievement_id: 2 },

  // 1월 19일
  { exercise_log_id: 13, member_id: 1, exercise_id: 13, performed_at: "2025-01-19T10:00:00", exercise_name: "스쿼트", duration_minutes: 30, achievement_id: 2 },
  { exercise_log_id: 14, member_id: 1, exercise_id: 15, performed_at: "2025-01-19T10:35:00", exercise_name: "런지", duration_minutes: 25, achievement_id: 2 },
  { exercise_log_id: 15, member_id: 1, exercise_id: 18, performed_at: "2025-01-19T11:05:00", exercise_name: "카프 레이즈", duration_minutes: 15, achievement_id: 2 },

  // 1월 18일
  { exercise_log_id: 16, member_id: 1, exercise_id: 7, performed_at: "2025-01-18T14:00:00", exercise_name: "데드리프트", duration_minutes: 30, achievement_id: 3 },
  { exercise_log_id: 17, member_id: 1, exercise_id: 10, performed_at: "2025-01-18T14:35:00", exercise_name: "바벨 로우", duration_minutes: 25, achievement_id: 3 },
  { exercise_log_id: 18, member_id: 1, exercise_id: 34, performed_at: "2025-01-18T15:05:00", exercise_name: "런닝머신", duration_minutes: 20, achievement_id: 3 },

  // 1월 17일
  { exercise_log_id: 19, member_id: 1, exercise_id: 19, performed_at: "2025-01-17T09:00:00", exercise_name: "숄더 프레스", duration_minutes: 25, achievement_id: 3 },
  { exercise_log_id: 20, member_id: 1, exercise_id: 20, performed_at: "2025-01-17T09:30:00", exercise_name: "사이드 레터럴 레이즈", duration_minutes: 20, achievement_id: 3 },

  // 1월 16일
  { exercise_log_id: 21, member_id: 1, exercise_id: 1, performed_at: "2025-01-16T16:00:00", exercise_name: "벤치프레스", duration_minutes: 30, achievement_id: null },
  { exercise_log_id: 22, member_id: 1, exercise_id: 5, performed_at: "2025-01-16T16:35:00", exercise_name: "딥스", duration_minutes: 20, achievement_id: null },

  // 1월 15일
  { exercise_log_id: 23, member_id: 1, exercise_id: 13, performed_at: "2025-01-15T10:00:00", exercise_name: "스쿼트", duration_minutes: 30, achievement_id: null },
  { exercise_log_id: 24, member_id: 1, exercise_id: 14, performed_at: "2025-01-15T10:35:00", exercise_name: "레그프레스", duration_minutes: 25, achievement_id: null },

  // 1월 14일
  { exercise_log_id: 25, member_id: 1, exercise_id: 8, performed_at: "2025-01-14T14:00:00", exercise_name: "풀업", duration_minutes: 20, achievement_id: null },
  { exercise_log_id: 26, member_id: 1, exercise_id: 9, performed_at: "2025-01-14T14:25:00", exercise_name: "랫풀다운", duration_minutes: 25, achievement_id: null },

  // 1월 13일
  { exercise_log_id: 27, member_id: 1, exercise_id: 24, performed_at: "2025-01-13T09:00:00", exercise_name: "바벨 컬", duration_minutes: 20, achievement_id: null },
  { exercise_log_id: 28, member_id: 1, exercise_id: 27, performed_at: "2025-01-13T09:25:00", exercise_name: "트라이셉스 익스텐션", duration_minutes: 20, achievement_id: null },

  // 1월 12일
  { exercise_log_id: 29, member_id: 1, exercise_id: 34, performed_at: "2025-01-12T10:00:00", exercise_name: "런닝머신", duration_minutes: 30, achievement_id: null },
  { exercise_log_id: 30, member_id: 1, exercise_id: 29, performed_at: "2025-01-12T10:35:00", exercise_name: "크런치", duration_minutes: 15, achievement_id: null },

  // 1월 11일
  { exercise_log_id: 31, member_id: 1, exercise_id: 1, performed_at: "2025-01-11T16:00:00", exercise_name: "벤치프레스", duration_minutes: 30, achievement_id: null },
  { exercise_log_id: 32, member_id: 1, exercise_id: 2, performed_at: "2025-01-11T16:35:00", exercise_name: "인클라인 벤치프레스", duration_minutes: 25, achievement_id: null },

  // 1월 10일
  { exercise_log_id: 33, member_id: 1, exercise_id: 13, performed_at: "2025-01-10T10:00:00", exercise_name: "스쿼트", duration_minutes: 30, achievement_id: null },
  { exercise_log_id: 34, member_id: 1, exercise_id: 15, performed_at: "2025-01-10T10:35:00", exercise_name: "런지", duration_minutes: 25, achievement_id: null },

  // 1월 9일
  { exercise_log_id: 35, member_id: 1, exercise_id: 7, performed_at: "2025-01-09T14:00:00", exercise_name: "데드리프트", duration_minutes: 30, achievement_id: null },
  { exercise_log_id: 36, member_id: 1, exercise_id: 11, performed_at: "2025-01-09T14:35:00", exercise_name: "시티드 로우", duration_minutes: 25, achievement_id: null },

  // 1월 8일
  { exercise_log_id: 37, member_id: 1, exercise_id: 19, performed_at: "2025-01-08T09:00:00", exercise_name: "숄더 프레스", duration_minutes: 25, achievement_id: null },
  { exercise_log_id: 38, member_id: 1, exercise_id: 21, performed_at: "2025-01-08T09:30:00", exercise_name: "프론트 레이즈", duration_minutes: 20, achievement_id: null },

  // 1월 7일
  { exercise_log_id: 39, member_id: 1, exercise_id: 35, performed_at: "2025-01-07T10:00:00", exercise_name: "사이클", duration_minutes: 30, achievement_id: null },
  { exercise_log_id: 40, member_id: 1, exercise_id: 30, performed_at: "2025-01-07T10:35:00", exercise_name: "플랭크", duration_minutes: 10, achievement_id: null }
];

// 음식 리스트 (FoodList) - 카테고리별 분류
const DUMMY_FOOD_LIST = [
  // 단백질 (고기/생선)
  { food_id: 1, name: "닭가슴살 구이", category: "단백질", calories: 165, status: "APPROVED" },
  { food_id: 2, name: "닭가슴살 샐러드", category: "단백질", calories: 250, status: "APPROVED" },
  { food_id: 3, name: "연어 구이", category: "단백질", calories: 280, status: "APPROVED" },
  { food_id: 4, name: "참치 통조림", category: "단백질", calories: 150, status: "APPROVED" },
  { food_id: 5, name: "소고기 스테이크", category: "단백질", calories: 350, status: "APPROVED" },
  { food_id: 6, name: "돼지고기 수육", category: "단백질", calories: 320, status: "APPROVED" },
  { food_id: 7, name: "계란 3개", category: "단백질", calories: 210, status: "APPROVED" },
  { food_id: 8, name: "두부 한 모", category: "단백질", calories: 180, status: "APPROVED" },

  // 탄수화물
  { food_id: 9, name: "현미밥 1공기", category: "탄수화물", calories: 300, status: "APPROVED" },
  { food_id: 10, name: "백미밥 1공기", category: "탄수화물", calories: 310, status: "APPROVED" },
  { food_id: 11, name: "고구마 1개", category: "탄수화물", calories: 130, status: "APPROVED" },
  { food_id: 12, name: "감자 1개", category: "탄수화물", calories: 110, status: "APPROVED" },
  { food_id: 13, name: "귀리 오트밀", category: "탄수화물", calories: 150, status: "APPROVED" },
  { food_id: 14, name: "통밀빵 2조각", category: "탄수화물", calories: 180, status: "APPROVED" },
  { food_id: 15, name: "현미 주먹밥", category: "탄수화물", calories: 200, status: "APPROVED" },

  // 채소/샐러드
  { food_id: 16, name: "그린 샐러드", category: "채소", calories: 50, status: "APPROVED" },
  { food_id: 17, name: "브로콜리", category: "채소", calories: 55, status: "APPROVED" },
  { food_id: 18, name: "시금치 나물", category: "채소", calories: 40, status: "APPROVED" },
  { food_id: 19, name: "양배추 샐러드", category: "채소", calories: 45, status: "APPROVED" },
  { food_id: 20, name: "토마토 2개", category: "채소", calories: 35, status: "APPROVED" },
  { food_id: 21, name: "오이 1개", category: "채소", calories: 15, status: "APPROVED" },
  { food_id: 22, name: "파프리카", category: "채소", calories: 30, status: "APPROVED" },

  // 과일
  { food_id: 23, name: "바나나 1개", category: "과일", calories: 105, status: "APPROVED" },
  { food_id: 24, name: "사과 1개", category: "과일", calories: 95, status: "APPROVED" },
  { food_id: 25, name: "블루베리 1컵", category: "과일", calories: 85, status: "APPROVED" },
  { food_id: 26, name: "딸기 10개", category: "과일", calories: 50, status: "APPROVED" },
  { food_id: 27, name: "오렌지 1개", category: "과일", calories: 65, status: "APPROVED" },
  { food_id: 28, name: "키위 2개", category: "과일", calories: 90, status: "APPROVED" },

  // 유제품
  { food_id: 29, name: "그릭 요거트", category: "유제품", calories: 130, status: "APPROVED" },
  { food_id: 30, name: "저지방 우유", category: "유제품", calories: 100, status: "APPROVED" },
  { food_id: 31, name: "치즈 2장", category: "유제품", calories: 150, status: "APPROVED" },
  { food_id: 32, name: "플레인 요거트", category: "유제품", calories: 110, status: "APPROVED" },

  // 보충제/음료
  { food_id: 33, name: "프로틴 쉐이크", category: "보충제", calories: 120, status: "APPROVED" },
  { food_id: 34, name: "프로틴 바", category: "보충제", calories: 200, status: "APPROVED" },
  { food_id: 35, name: "아몬드 한줌", category: "보충제", calories: 160, status: "APPROVED" },
  { food_id: 36, name: "땅콩버터 1스푼", category: "보충제", calories: 95, status: "APPROVED" },

  // 한식
  { food_id: 37, name: "김치찌개", category: "한식", calories: 250, status: "APPROVED" },
  { food_id: 38, name: "된장찌개", category: "한식", calories: 180, status: "APPROVED" },
  { food_id: 39, name: "제육볶음", category: "한식", calories: 400, status: "APPROVED" },
  { food_id: 40, name: "불고기", category: "한식", calories: 350, status: "APPROVED" },
  { food_id: 41, name: "비빔밥", category: "한식", calories: 550, status: "APPROVED" },
  { food_id: 42, name: "삼계탕", category: "한식", calories: 600, status: "APPROVED" },

  // 간식
  { food_id: 43, name: "에너지바", category: "간식", calories: 180, status: "APPROVED" },
  { food_id: 44, name: "견과류 믹스", category: "간식", calories: 170, status: "APPROVED" },
  { food_id: 45, name: "다크 초콜릿", category: "간식", calories: 150, status: "APPROVED" }
];

// 식단 로그 더미 데이터 (최근 30일)
const DUMMY_DIET_LOGS = [
  // 1월 23일
  { diet_log_id: 1, member_id: 1, food_id: 13, ate_at: "2025-01-23T07:00:00", meal_type: "아침", food_name: "귀리 오트밀", calories: 150, achievement_id: null },
  { diet_log_id: 2, member_id: 1, food_id: 23, ate_at: "2025-01-23T07:30:00", meal_type: "아침", food_name: "바나나 1개", calories: 105, achievement_id: null },
  { diet_log_id: 3, member_id: 1, food_id: 41, ate_at: "2025-01-23T12:00:00", meal_type: "점심", food_name: "비빔밥", calories: 550, achievement_id: null },
  { diet_log_id: 4, member_id: 1, food_id: 3, ate_at: "2025-01-23T19:00:00", meal_type: "저녁", food_name: "연어 구이", calories: 280, achievement_id: null },
  { diet_log_id: 5, member_id: 1, food_id: 17, ate_at: "2025-01-23T19:30:00", meal_type: "저녁", food_name: "브로콜리", calories: 55, achievement_id: null },

  // 1월 22일
  { diet_log_id: 6, member_id: 1, food_id: 7, ate_at: "2025-01-22T07:30:00", meal_type: "아침", food_name: "계란 3개", calories: 210, achievement_id: 1 },
  { diet_log_id: 7, member_id: 1, food_id: 14, ate_at: "2025-01-22T07:45:00", meal_type: "아침", food_name: "통밀빵 2조각", calories: 180, achievement_id: 1 },
  { diet_log_id: 8, member_id: 1, food_id: 40, ate_at: "2025-01-22T12:30:00", meal_type: "점심", food_name: "불고기", calories: 350, achievement_id: 1 },
  { diet_log_id: 9, member_id: 1, food_id: 9, ate_at: "2025-01-22T12:45:00", meal_type: "점심", food_name: "현미밥 1공기", calories: 300, achievement_id: 1 },
  { diet_log_id: 10, member_id: 1, food_id: 1, ate_at: "2025-01-22T19:00:00", meal_type: "저녁", food_name: "닭가슴살 구이", calories: 165, achievement_id: 1 },
  { diet_log_id: 11, member_id: 1, food_id: 11, ate_at: "2025-01-22T19:20:00", meal_type: "저녁", food_name: "고구마 1개", calories: 130, achievement_id: 1 },

  // 1월 21일
  { diet_log_id: 12, member_id: 1, food_id: 29, ate_at: "2025-01-21T07:00:00", meal_type: "아침", food_name: "그릭 요거트", calories: 130, achievement_id: 2 },
  { diet_log_id: 13, member_id: 1, food_id: 25, ate_at: "2025-01-21T07:20:00", meal_type: "아침", food_name: "블루베리 1컵", calories: 85, achievement_id: 2 },
  { diet_log_id: 14, member_id: 1, food_id: 42, ate_at: "2025-01-21T12:00:00", meal_type: "점심", food_name: "삼계탕", calories: 600, achievement_id: 2 },
  { diet_log_id: 15, member_id: 1, food_id: 2, ate_at: "2025-01-21T19:00:00", meal_type: "저녁", food_name: "닭가슴살 샐러드", calories: 250, achievement_id: 2 },
  { diet_log_id: 16, member_id: 1, food_id: 33, ate_at: "2025-01-21T21:00:00", meal_type: "간식", food_name: "프로틴 쉐이크", calories: 120, achievement_id: 2 },

  // 1월 20일
  { diet_log_id: 17, member_id: 1, food_id: 13, ate_at: "2025-01-20T07:00:00", meal_type: "아침", food_name: "귀리 오트밀", calories: 150, achievement_id: 2 },
  { diet_log_id: 18, member_id: 1, food_id: 24, ate_at: "2025-01-20T07:30:00", meal_type: "아침", food_name: "사과 1개", calories: 95, achievement_id: 2 },
  { diet_log_id: 19, member_id: 1, food_id: 39, ate_at: "2025-01-20T12:00:00", meal_type: "점심", food_name: "제육볶음", calories: 400, achievement_id: 3 },
  { diet_log_id: 20, member_id: 1, food_id: 9, ate_at: "2025-01-20T12:20:00", meal_type: "점심", food_name: "현미밥 1공기", calories: 300, achievement_id: 3 },
  { diet_log_id: 21, member_id: 1, food_id: 5, ate_at: "2025-01-20T19:00:00", meal_type: "저녁", food_name: "소고기 스테이크", calories: 350, achievement_id: 3 },

  // 1월 19일
  { diet_log_id: 22, member_id: 1, food_id: 7, ate_at: "2025-01-19T07:30:00", meal_type: "아침", food_name: "계란 3개", calories: 210, achievement_id: 3 },
  { diet_log_id: 23, member_id: 1, food_id: 11, ate_at: "2025-01-19T07:50:00", meal_type: "아침", food_name: "고구마 1개", calories: 130, achievement_id: 3 },
  { diet_log_id: 24, member_id: 1, food_id: 37, ate_at: "2025-01-19T12:00:00", meal_type: "점심", food_name: "김치찌개", calories: 250, achievement_id: 3 },
  { diet_log_id: 25, member_id: 1, food_id: 10, ate_at: "2025-01-19T12:20:00", meal_type: "점심", food_name: "백미밥 1공기", calories: 310, achievement_id: 3 },
  { diet_log_id: 26, member_id: 1, food_id: 3, ate_at: "2025-01-19T19:00:00", meal_type: "저녁", food_name: "연어 구이", calories: 280, achievement_id: null },

  // 1월 18일
  { diet_log_id: 27, member_id: 1, food_id: 29, ate_at: "2025-01-18T07:00:00", meal_type: "아침", food_name: "그릭 요거트", calories: 130, achievement_id: null },
  { diet_log_id: 28, member_id: 1, food_id: 44, ate_at: "2025-01-18T10:00:00", meal_type: "간식", food_name: "견과류 믹스", calories: 170, achievement_id: null },
  { diet_log_id: 29, member_id: 1, food_id: 41, ate_at: "2025-01-18T12:00:00", meal_type: "점심", food_name: "비빔밥", calories: 550, achievement_id: null },
  { diet_log_id: 30, member_id: 1, food_id: 1, ate_at: "2025-01-18T19:00:00", meal_type: "저녁", food_name: "닭가슴살 구이", calories: 165, achievement_id: null },

  // 1월 17일
  { diet_log_id: 31, member_id: 1, food_id: 13, ate_at: "2025-01-17T07:00:00", meal_type: "아침", food_name: "귀리 오트밀", calories: 150, achievement_id: null },
  { diet_log_id: 32, member_id: 1, food_id: 40, ate_at: "2025-01-17T12:00:00", meal_type: "점심", food_name: "불고기", calories: 350, achievement_id: null },
  { diet_log_id: 33, member_id: 1, food_id: 9, ate_at: "2025-01-17T12:20:00", meal_type: "점심", food_name: "현미밥 1공기", calories: 300, achievement_id: null },
  { diet_log_id: 34, member_id: 1, food_id: 2, ate_at: "2025-01-17T19:00:00", meal_type: "저녁", food_name: "닭가슴살 샐러드", calories: 250, achievement_id: null },

  // 1월 16일
  { diet_log_id: 35, member_id: 1, food_id: 7, ate_at: "2025-01-16T07:30:00", meal_type: "아침", food_name: "계란 3개", calories: 210, achievement_id: null },
  { diet_log_id: 36, member_id: 1, food_id: 38, ate_at: "2025-01-16T12:00:00", meal_type: "점심", food_name: "된장찌개", calories: 180, achievement_id: null },
  { diet_log_id: 37, member_id: 1, food_id: 10, ate_at: "2025-01-16T12:20:00", meal_type: "점심", food_name: "백미밥 1공기", calories: 310, achievement_id: null },
  { diet_log_id: 38, member_id: 1, food_id: 3, ate_at: "2025-01-16T19:00:00", meal_type: "저녁", food_name: "연어 구이", calories: 280, achievement_id: null },

  // 1월 15일
  { diet_log_id: 39, member_id: 1, food_id: 29, ate_at: "2025-01-15T07:00:00", meal_type: "아침", food_name: "그릭 요거트", calories: 130, achievement_id: null },
  { diet_log_id: 40, member_id: 1, food_id: 23, ate_at: "2025-01-15T07:20:00", meal_type: "아침", food_name: "바나나 1개", calories: 105, achievement_id: null },
  { diet_log_id: 41, member_id: 1, food_id: 39, ate_at: "2025-01-15T12:00:00", meal_type: "점심", food_name: "제육볶음", calories: 400, achievement_id: null },
  { diet_log_id: 42, member_id: 1, food_id: 9, ate_at: "2025-01-15T12:20:00", meal_type: "점심", food_name: "현미밥 1공기", calories: 300, achievement_id: null },
  { diet_log_id: 43, member_id: 1, food_id: 1, ate_at: "2025-01-15T19:00:00", meal_type: "저녁", food_name: "닭가슴살 구이", calories: 165, achievement_id: null },

  // 1월 14일
  { diet_log_id: 44, member_id: 1, food_id: 13, ate_at: "2025-01-14T07:00:00", meal_type: "아침", food_name: "귀리 오트밀", calories: 150, achievement_id: null },
  { diet_log_id: 45, member_id: 1, food_id: 42, ate_at: "2025-01-14T12:00:00", meal_type: "점심", food_name: "삼계탕", calories: 600, achievement_id: null },
  { diet_log_id: 46, member_id: 1, food_id: 2, ate_at: "2025-01-14T19:00:00", meal_type: "저녁", food_name: "닭가슴살 샐러드", calories: 250, achievement_id: null },

  // 1월 13일
  { diet_log_id: 47, member_id: 1, food_id: 7, ate_at: "2025-01-13T07:30:00", meal_type: "아침", food_name: "계란 3개", calories: 210, achievement_id: null },
  { diet_log_id: 48, member_id: 1, food_id: 41, ate_at: "2025-01-13T12:00:00", meal_type: "점심", food_name: "비빔밥", calories: 550, achievement_id: null },
  { diet_log_id: 49, member_id: 1, food_id: 5, ate_at: "2025-01-13T19:00:00", meal_type: "저녁", food_name: "소고기 스테이크", calories: 350, achievement_id: null },

  // 1월 12일
  { diet_log_id: 50, member_id: 1, food_id: 29, ate_at: "2025-01-12T07:00:00", meal_type: "아침", food_name: "그릭 요거트", calories: 130, achievement_id: null }
];

// 건강 기록 더미 데이터 (주간 측정)
const DUMMY_HEALTH_RECORDS = [
  { record_id: 1, member_id: 1, measured_at: "2025-01-23", height_cm: 175, weight_kg: 74.2, muscle_mass_kg: 32.5, fat_mass_kg: 10.8, bmi: 24.2 },
  { record_id: 2, member_id: 1, measured_at: "2025-01-20", height_cm: 175, weight_kg: 74.5, muscle_mass_kg: 32.3, fat_mass_kg: 11.0, bmi: 24.3 },
  { record_id: 3, member_id: 1, measured_at: "2025-01-16", height_cm: 175, weight_kg: 74.8, muscle_mass_kg: 32.0, fat_mass_kg: 11.2, bmi: 24.4 },
  { record_id: 4, member_id: 1, measured_at: "2025-01-13", height_cm: 175, weight_kg: 75.0, muscle_mass_kg: 32.0, fat_mass_kg: 11.25, bmi: 24.5 },
  { record_id: 5, member_id: 1, measured_at: "2025-01-09", height_cm: 175, weight_kg: 75.3, muscle_mass_kg: 31.8, fat_mass_kg: 11.5, bmi: 24.6 },
  { record_id: 6, member_id: 1, measured_at: "2025-01-06", height_cm: 175, weight_kg: 75.5, muscle_mass_kg: 31.7, fat_mass_kg: 11.7, bmi: 24.7 },
  { record_id: 7, member_id: 1, measured_at: "2025-01-02", height_cm: 175, weight_kg: 76.0, muscle_mass_kg: 31.5, fat_mass_kg: 12.16, bmi: 24.8 }
];

const DUMMY_ATTENDANCES = [
  {
    attendance_id: 1,
    member_id: 1,
    entered_at: "2025-01-13T09:00:00",
    left_at: "2025-01-13T11:00:00",
    attendance_type: "헬스장",
    achievement_id: 3
  },
  {
    attendance_id: 2,
    member_id: 1,
    entered_at: "2025-01-14T10:00:00",
    left_at: "2025-01-14T12:00:00",
    attendance_type: "헬스장",
    achievement_id: 3
  },
  {
    attendance_id: 3,
    member_id: 1,
    entered_at: "2025-01-15T09:30:00",
    left_at: "2025-01-15T11:30:00",
    attendance_type: "헬스장",
    achievement_id: null
  },
  {
    attendance_id: 4,
    member_id: 1,
    entered_at: "2025-01-16T14:00:00",
    left_at: "2025-01-16T16:00:00",
    attendance_type: "수업",
    achievement_id: null
  },
  {
    attendance_id: 5,
    member_id: 1,
    entered_at: "2025-01-17T11:00:00",
    left_at: null,
    attendance_type: "헬스장",
    achievement_id: null
  }
];

// AchievementLog 기반 포인트 내역
const DUMMY_POINT_HISTORY = [
  {
    achievement_id: 1,
    member_id: 1,
    policy_id: 1,
    source_type: "EXERCISE",
    points_earned: 100,
    points_snapshot: 400,
    achieved_at: "2025-01-15T12:00:00",
    description: "운동 5회 달성"
  },
  {
    achievement_id: 2,
    member_id: 1,
    policy_id: 2,
    source_type: "DIET",
    points_earned: 50,
    points_snapshot: 350,
    achieved_at: "2025-01-14T12:00:00",
    description: "식단 기록 3회"
  },
  {
    achievement_id: 3,
    member_id: 1,
    policy_id: 3,
    source_type: "ATTENDANCE",
    points_earned: 200,
    points_snapshot: 150,
    achieved_at: "2025-01-13T18:00:00",
    description: "출석 10회 달성"
  }
];

// 포인트 사용 내역 (PointExchange)
const DUMMY_POINT_EXCHANGES = [
  {
    exchange_id: 1,
    member_id: 1,
    reward_id: 1,
    used_points: 200,
    exchanged_at: "2025-01-10T15:00:00",
    reward_name: "프로틴 쉐이크"
  }
];

// 뱃지 목록 (Badge)
const DUMMY_BADGES = [
  { badge_id: 1, badge_name: "헬스 입문자", icon: "🏋️", description: "첫 운동 기록 달성" },
  { badge_id: 2, badge_name: "식단 관리자", icon: "🥗", description: "식단 기록 10회 달성" },
  { badge_id: 3, badge_name: "출석왕", icon: "👑", description: "30일 연속 출석" },
  { badge_id: 4, badge_name: "근육 빌더", icon: "💪", description: "운동 100회 달성" },
  { badge_id: 5, badge_name: "목표 달성자", icon: "🎯", description: "목표 5개 달성" },
  { badge_id: 6, badge_name: "포인트 부자", icon: "💰", description: "1000포인트 획득" },
  { badge_id: 7, badge_name: "건강 지킴이", icon: "❤️", description: "건강 기록 20회 작성" },
  { badge_id: 8, badge_name: "멘토", icon: "🎓", description: "멘토링 10회 완료" }
];

// 회원이 획득한 뱃지 (MemberBadge)
const DUMMY_MEMBER_BADGES = [
  {
    member_badge_id: 1,
    member_id: 1,
    badge_id: 1,
    earned_at: "2025-01-10T10:00:00"
  },
  {
    member_badge_id: 2,
    member_id: 1,
    badge_id: 2,
    earned_at: "2025-01-12T15:30:00"
  },
  {
    member_badge_id: 3,
    member_id: 1,
    badge_id: 5,
    earned_at: "2025-01-14T18:00:00"
  },
  {
    member_badge_id: 4,
    member_id: 1,
    badge_id: 6,
    earned_at: "2025-01-15T12:00:00"
  }
];

export default function MyPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [dietLogs, setDietLogs] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [pointHistory, setPointHistory] = useState([]);
  const [pointExchanges, setPointExchanges] = useState([]);
  const [badges, setBadges] = useState([]);
  const [memberBadges, setMemberBadges] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('myPageTheme');
    return saved ? saved === 'dark' : true;
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPointModal, setShowPointModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [recordType, setRecordType] = useState('exercise'); // 'exercise', 'diet', 'health'
  const [showGoalPanel, setShowGoalPanel] = useState(false);

  useEffect(() => {
    localStorage.setItem('myPageTheme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // 더미 데이터 로드
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);

      // 더미 데이터를 비동기처럼 로드 (실제 API 호출 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 500));

      setCurrentUser(DUMMY_USER);
      setExerciseLogs(DUMMY_EXERCISE_LOGS);
      setDietLogs(DUMMY_DIET_LOGS);
      setHealthRecords(DUMMY_HEALTH_RECORDS);
      setAttendances(DUMMY_ATTENDANCES);
      setPointHistory(DUMMY_POINT_HISTORY);
      setPointExchanges(DUMMY_POINT_EXCHANGES);
      setBadges(DUMMY_BADGES);
      setMemberBadges(DUMMY_MEMBER_BADGES);
      setExerciseList(DUMMY_EXERCISE_LIST);
      setFoodList(DUMMY_FOOD_LIST);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 기록 추가 모달 열기
  const openAddRecordModal = (type) => {
    setRecordType(type);
    setShowAddRecordModal(true);
  };

  // 운동 기록 추가
  const addExerciseLog = (exerciseId, duration) => {
    const exercise = exerciseList.find(e => e.exercise_id === exerciseId);
    if (!exercise) return;

    const newLog = {
      exercise_log_id: exerciseLogs.length + 1,
      member_id: currentUser.member_id,
      exercise_id: exerciseId,
      performed_at: new Date().toISOString(),
      exercise_name: exercise.name,
      duration_minutes: duration,
      achievement_id: null
    };

    setExerciseLogs([...exerciseLogs, newLog]);
    setShowAddRecordModal(false);
  };

  // 식단 기록 추가
  const addDietLog = (foodId, mealType) => {
    const food = foodList.find(f => f.food_id === foodId);
    if (!food) return;

    const newLog = {
      diet_log_id: dietLogs.length + 1,
      member_id: currentUser.member_id,
      food_id: foodId,
      ate_at: new Date().toISOString(),
      meal_type: mealType,
      food_name: food.name,
      calories: food.calories,
      achievement_id: null
    };

    setDietLogs([...dietLogs, newLog]);
    setShowAddRecordModal(false);
  };

  // 건강 기록 추가
  const addHealthRecord = (data) => {
    const newRecord = {
      record_id: healthRecords.length + 1,
      member_id: currentUser.member_id,
      measured_at: new Date().toISOString().split('T')[0],
      height_cm: data.height,
      weight_kg: data.weight,
      muscle_mass_kg: data.muscle,
      fat_mass_kg: data.fat,
      bmi: (data.weight / ((data.height / 100) ** 2)).toFixed(1)
    };

    setHealthRecords([...healthRecords, newRecord]);
    setShowAddRecordModal(false);
  };

  // 캘린더 생성
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  // 현재 날짜 체크
  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // 출석 체크
  const isAttendance = (day) => {
    if (!day || !Array.isArray(attendances)) return false;
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return attendances.some((a) => {
      const attendDate = new Date(a.entered_at).toISOString().split("T")[0];
      return attendDate === dateStr;
    });
  };

  // 날짜 클릭
  const handleDateClick = (day) => {
    if (!day) return;
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
  };

  // 선택된 날짜의 기록 필터링
  const getRecordsForDate = (date) => {
    return {
      exercises: exerciseLogs.filter((log) => {
        const logDate = new Date(log.performed_at).toISOString().split("T")[0];
        return logDate === date;
      }),
      diets: dietLogs.filter((log) => {
        const logDate = new Date(log.ate_at).toISOString().split("T")[0];
        return logDate === date;
      }),
      health: healthRecords.filter((log) => log.measured_at === date),
    };
  };

  const selectedRecords = selectedDate ? getRecordsForDate(selectedDate) : null;
  const days = getDaysInMonth(currentDate);
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  // 날짜 포맷팅
  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'} flex items-center justify-center`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className={`inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'} mb-4`}></div>
          <div className="text-xl font-semibold">로딩 중...</div>
        </motion.div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'} flex items-center justify-center`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-xl">회원 정보를 불러올 수 없습니다</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'} p-6 transition-colors duration-300`}>
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              마이페이지
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg`}>{currentUser.name}님의 활동 기록</p>
          </div>
          <div className="flex items-center gap-4">
            {/* 다크모드 토글 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDark(!isDark)}
              className={`p-3 rounded-xl font-semibold transition ${isDark
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-white hover:bg-gray-100 shadow-lg'
                }`}
              title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {isDark ? (
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </motion.button>

            <div className="text-right">
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>총 출석일</div>
              <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {Array.isArray(attendances) ? attendances.length : 0}일
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 캘린더 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className={`rounded-2xl p-6 border shadow-2xl ${isDark
            ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50'
            : 'bg-white border-gray-200'
            }`}>
            <div className="flex items-center justify-between mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
                  )
                }
                className="px-5 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl transition text-lg font-semibold shadow-lg"
              >
                ←
              </motion.button>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
                  )
                }
                className="px-5 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl transition text-lg font-semibold shadow-lg"
              >
                →
              </motion.button>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map((day, index) => (
                <div
                  key={day}
                  className={`text-center font-bold py-2 ${index === 0 ? "text-red-400" : index === 6 ? "text-blue-400" : "text-gray-400"
                    }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                const isTodayDate = isToday(day);
                const hasAttendance = isAttendance(day);
                const isSelected = selectedDate ===
                  `${currentDate.getFullYear()}-${String(
                    currentDate.getMonth() + 1
                  ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleDateClick(day)}
                    disabled={!day}
                    whileHover={day ? { scale: 1.08, y: -2 } : {}}
                    whileTap={day ? { scale: 0.95 } : {}}
                    className={`
                      aspect-square rounded-xl flex items-center justify-center text-lg font-bold
                      transition-all relative overflow-hidden
                      ${!day ? "invisible" : ""}
                      ${isTodayDate && !hasAttendance
                        ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50 ring-2 ring-yellow-400"
                        : ""
                      }
                      ${hasAttendance
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                        : !isTodayDate ? "bg-gray-800/80 hover:bg-gray-700/80 text-white" : ""
                      }
                      ${isSelected
                        ? "ring-4 ring-blue-400 ring-offset-2 ring-offset-gray-900"
                        : ""
                      }
                    `}
                  >
                    {day}
                    {hasAttendance && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>
                    )}
                    {isTodayDate && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-300 rounded-full"></div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* 기록 추가 버튼들 */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openAddRecordModal('exercise')}
              className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl p-4 font-bold shadow-lg transition flex flex-col items-center gap-2"
            >
              <span className="text-3xl">💪</span>
              <span>운동 기록</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openAddRecordModal('diet')}
              className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl p-4 font-bold shadow-lg transition flex flex-col items-center gap-2"
            >
              <span className="text-3xl">🍽️</span>
              <span>식단 기록</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openAddRecordModal('health')}
              className="bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl p-4 font-bold shadow-lg transition flex flex-col items-center gap-2"
            >
              <span className="text-3xl">❤️</span>
              <span>건강 기록</span>
            </motion.button>
          </div>

          {/* 선택된 날짜의 기록 */}
          <AnimatePresence>
            {selectedDate && selectedRecords && (
              <DailyRecordCard
                date={selectedDate}
                records={selectedRecords}
                isDark={isDark}
                onClose={() => setSelectedDate(null)}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* 오른쪽: 포인트 & 회원정보 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* 포인트 카드 */}
          <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 cursor-pointer shadow-2xl shadow-purple-500/30 relative overflow-hidden"
            onClick={() => setShowPointModal(true)}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-2 text-white/90">나의 포인트</h3>
              <p className="text-5xl font-extrabold mb-2">
                {(currentUser.total_points || 0).toLocaleString()}P
              </p>
              <p className="text-sm text-white/80">클릭하여 내역 확인 →</p>
            </div>
          </motion.div>

          {/* 회원 정보 */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              회원 정보
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-400">이름</span>
                <span className="font-bold text-lg">{currentUser.name}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-400">학번</span>
                <span className="font-bold">{currentUser.student_no}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-400">학과</span>
                <span className="font-bold">{currentUser.department}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-400">학년</span>
                <span className="font-bold">{currentUser.grade}학년</span>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              이번 달 활동
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-900/30 p-4 rounded-xl text-center border border-blue-700/30">
                <div className="text-3xl font-bold text-blue-400">
                  {exerciseLogs.filter(log => {
                    const logMonth = new Date(log.performed_at).getMonth();
                    return logMonth === currentDate.getMonth();
                  }).length}
                </div>
                <div className="text-xs text-gray-400 mt-1">운동 기록</div>
              </div>
              <div className="bg-green-900/30 p-4 rounded-xl text-center border border-green-700/30">
                <div className="text-3xl font-bold text-green-400">
                  {dietLogs.filter(log => {
                    const logMonth = new Date(log.ate_at).getMonth();
                    return logMonth === currentDate.getMonth();
                  }).length}
                </div>
                <div className="text-xs text-gray-400 mt-1">식단 기록</div>
              </div>
            </div>
          </div>

          {/* 뱃지 카드 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl cursor-pointer"
            onClick={() => setShowBadgeModal(true)}
          >
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-2xl">🏆</span> 나의 뱃지
            </h3>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {memberBadges.slice(0, 4).map((mb) => {
                const badge = badges.find(b => b.badge_id === mb.badge_id);
                return badge ? (
                  <motion.div
                    key={mb.member_badge_id}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="aspect-square bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center text-3xl border border-yellow-500/30"
                    title={badge.badge_name}
                  >
                    {badge.icon}
                  </motion.div>
                ) : null;
              })}
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-400">
                {memberBadges.length}개 획득 • 클릭하여 전체 보기 →
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 포인트 내역 모달 */}
      <AnimatePresence>
        {showPointModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPointModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700 shadow-2xl"
            >
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                포인트 내역
              </h2>

              {pointHistory.length > 0 || pointExchanges.length > 0 ? (
                <div className="space-y-3">
                  {/* 포인트 획득 내역 */}
                  {pointHistory.map((item) => (
                    <motion.div
                      key={`earn-${item.achievement_id}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl flex justify-between items-center border border-gray-700/50 hover:border-gray-600/50 transition"
                    >
                      <div>
                        <div className="font-semibold text-lg">
                          {item.description}
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatDateTime(item.achieved_at)} • {item.source_type}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-green-400">
                        +{item.points_earned}P
                      </div>
                    </motion.div>
                  ))}

                  {/* 포인트 사용 내역 */}
                  {pointExchanges.map((item) => (
                    <motion.div
                      key={`use-${item.exchange_id}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl flex justify-between items-center border border-gray-700/50 hover:border-gray-600/50 transition"
                    >
                      <div>
                        <div className="font-semibold text-lg">
                          {item.reward_name} 교환
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatDateTime(item.exchanged_at)}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-red-400">
                        -{item.used_points}P
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-12 text-lg">
                  포인트 내역이 없습니다.
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPointModal(false)}
                className="mt-6 w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold text-lg transition shadow-lg"
              >
                닫기
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 뱃지 모달 */}
      <AnimatePresence>
        {showBadgeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowBadgeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-gray-700 shadow-2xl"
            >
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center gap-3">
                <span className="text-4xl">🏆</span> 뱃지 컬렉션
              </h2>

              {/* 획득한 뱃지 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
                  <span>✓</span> 획득한 뱃지 ({memberBadges.length}개)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {memberBadges.map((mb) => {
                    const badge = badges.find(b => b.badge_id === mb.badge_id);
                    return badge ? (
                      <motion.div
                        key={mb.member_badge_id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-4 rounded-xl border border-yellow-500/50 text-center relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/10 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                          <div className="text-5xl mb-2">{badge.icon}</div>
                          <div className="font-bold text-lg mb-1">{badge.badge_name}</div>
                          <div className="text-xs text-gray-400 mb-2">{badge.description}</div>
                          <div className="text-xs text-green-400">
                            {formatDateTime(mb.earned_at)}
                          </div>
                        </div>
                      </motion.div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* 미획득 뱃지 */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-400 flex items-center gap-2">
                  <span>🔒</span> 미획득 뱃지 ({badges.length - memberBadges.length}개)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {badges
                    .filter(badge => !memberBadges.some(mb => mb.badge_id === badge.badge_id))
                    .map((badge) => (
                      <motion.div
                        key={badge.badge_id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 text-center opacity-50 grayscale"
                      >
                        <div className="text-5xl mb-2">{badge.icon}</div>
                        <div className="font-bold text-lg mb-1">{badge.badge_name}</div>
                        <div className="text-xs text-gray-500">{badge.description}</div>
                      </motion.div>
                    ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowBadgeModal(false)}
                className="mt-8 w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-xl font-bold text-lg transition shadow-lg"
              >
                닫기
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 기록 추가 모달 */}
      <AnimatePresence>
        {showAddRecordModal && (
          <AddRecordModal
            type={recordType}
            isDark={isDark}
            exerciseList={exerciseList}
            foodList={foodList}
            onClose={() => setShowAddRecordModal(false)}
            onAddExercise={addExerciseLog}
            onAddDiet={addDietLog}
            onAddHealth={addHealthRecord}
          />
        )}
      </AnimatePresence>

      {/* 나의 요약 섹션 */}
      <div className="max-w-7xl mx-auto mt-8">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          📊 나의 요약
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 최근 활동 요약 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-6 border shadow-xl ${isDark
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50'
              : 'bg-white border-gray-200'
              }`}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🔥</span> 최근 활동 요약
            </h3>
            <div className="space-y-3">
              <div className="text-sm text-gray-400">이번 달은 화요일, 목요일에 집중히 운동하셨어요!</div>
              <div className="flex justify-around items-end h-32 bg-gray-800/30 rounded-lg p-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xs text-gray-400">월</div>
                  <div className="w-8 bg-gray-700 rounded-t" style={{ height: '20%' }}></div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xs text-blue-400 font-bold">4번</div>
                  <div className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" style={{ height: '80%' }}></div>
                  <div className="text-xs text-gray-400">화</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xs text-gray-400">수</div>
                  <div className="w-8 bg-gray-700 rounded-t" style={{ height: '40%' }}></div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xs text-blue-400 font-bold">4번</div>
                  <div className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" style={{ height: '80%' }}></div>
                  <div className="text-xs text-gray-400">목</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xs text-gray-400">금</div>
                  <div className="w-8 bg-gray-700 rounded-t" style={{ height: '30%' }}></div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xs text-gray-400">토</div>
                  <div className="w-8 bg-gray-700 rounded-t" style={{ height: '50%' }}></div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xs text-gray-400">일</div>
                  <div className="w-8 bg-gray-700 rounded-t" style={{ height: '10%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 많이 수행한 운동 TOP 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-2xl p-6 border shadow-xl ${isDark
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50'
              : 'bg-white border-gray-200'
              }`}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl"></span> 많이 수행한 운동 TOP 3
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="inline-block px-3 py-1 bg-gray-700 rounded-full text-xs font-bold mb-2">TOP 1</div>
                <div className="text-lg font-bold text-blue-400 mb-1">바벨 로우 총 5번 수행했어요.</div>
                <div className="text-xs text-gray-400">평균 5 세트 운동했으며, 다른 운동보다 0.9 세트 더 수행했어요.</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">TOP 2</span>
                <span className="font-bold">스쿼트 4번</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">TOP 3</span>
                <span className="font-bold">벤치프레스 4번</span>
              </div>
            </div>
          </motion.div>

          {/* 많이 성장한 운동 TOP 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl p-6 border shadow-xl ${isDark
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50'
              : 'bg-white border-gray-200'
              }`}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">📈</span> 많이 성장한 운동 TOP 3
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="inline-block px-3 py-1 bg-gray-700 rounded-full text-xs font-bold mb-2">TOP 1</div>
                <div className="text-lg font-bold mb-3">
                  시티드 덤벨 트라이셉 익스텐션 수행 능력이 <span className="text-blue-400">307.8%</span> 증가했어요.
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-500">9 kg</div>
                    <div className="text-xs text-gray-400">이전 기록</div>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">36.7 kg</div>
                    <div className="text-xs text-gray-400">7월</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">TOP 2</span>
                <span className="font-bold">데드리프트 +45%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">TOP 3</span>
                <span className="font-bold">스쿼트 +32%</span>
              </div>
            </div>
          </motion.div>

          {/* 부위별 운동 분석 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl p-6 border shadow-xl ${isDark
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50'
              : 'bg-white border-gray-200'
              }`}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🔍</span> 부위별 운동 분석
            </h3>
            <div className="text-sm text-gray-400 mb-4">제일 많이 수행한 부위는 등이며, 총 12번을 수행했습니다.</div>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="80" fill="none" stroke="#374151" strokeWidth="20" />
                  <circle cx="96" cy="96" r="80" fill="none" stroke="#3B82F6" strokeWidth="20"
                    strokeDasharray="150 502" strokeLinecap="round" />
                  <circle cx="96" cy="96" r="80" fill="none" stroke="#60A5FA" strokeWidth="20"
                    strokeDasharray="100 502" strokeDashoffset="-150" strokeLinecap="round" />
                  <circle cx="96" cy="96" r="80" fill="none" stroke="#93C5FD" strokeWidth="20"
                    strokeDasharray="70 502" strokeDashoffset="-250" strokeLinecap="round" />
                  <circle cx="96" cy="96" r="80" fill="none" stroke="#DBEAFE" strokeWidth="20"
                    strokeDasharray="60 502" strokeDashoffset="-320" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs text-gray-400">운동 부위</div>
                    <div className="text-lg font-bold">TOP 5</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>등 | 24%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span>하체 | 20%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                <span>팔 | 14%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                <span>복근 | 12%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                <span className="text-gray-400">그 외 | 31%</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">* 범위는 이번 기간 그래프 결과 집계가 완료되지 않을 수 있습니다.</div>
          </motion.div>

          {/* 이번달 요약 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-2xl p-6 border shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">💪 이번달 요약</h3>
              <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-sm">?</span>
              </button>
            </div>
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <div className="text-sm opacity-80 mb-2">2025년 1월의 타이틀</div>
              <div className="text-lg font-bold">헬라밴을 추구하는 진심 운동 애호가 ☀️</div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <div className="w-2 h-2 rounded-full bg-white/50"></div>
              <div className="w-2 h-2 rounded-full bg-white/50"></div>
            </div>
          </motion.div>

          {/* 체중 변화 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`rounded-2xl p-6 border shadow-xl ${isDark
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50'
              : 'bg-white border-gray-200'
              }`}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">⚖️</span> 체중 변화
            </h3>
            <div className="text-sm text-gray-400 mb-4">최근 30일간 체중이 1.8kg 감소했어요!</div>

            {/* Chart.js 차트 */}
            <WeightChart healthRecords={healthRecords} isDark={isDark} />

            <div className="mt-4 flex items-center justify-between text-sm">
              <div>
                <div className="text-gray-400">시작</div>
                <div className="font-bold">76.0 kg</div>
              </div>
              <div className="text-green-400 font-bold">-1.8 kg ↓</div>
              <div>
                <div className="text-gray-400">현재</div>
                <div className="font-bold text-green-400">74.2 kg</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 목표 관리 버튼 (고정) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowGoalPanel(true)}
        className="fixed right-6 bottom-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center text-3xl z-40 hover:shadow-purple-500/50 transition-all"
      >
        🎯
      </motion.button>

      {/* 목표 관리 사이드 패널 */}
      <AnimatePresence>
        {showGoalPanel && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGoalPanel(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* 사이드 패널 */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed right-0 top-0 h-full w-full md:w-[600px] lg:w-[700px] z-50 overflow-y-auto ${isDark
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
                : 'bg-gradient-to-br from-white via-gray-50 to-white'
                } shadow-2xl`}
            >
              {/* 패널 헤더 */}
              <div className={`sticky top-0 z-10 p-6 border-b backdrop-blur-sm ${isDark
                ? 'bg-gray-900/80 border-gray-700'
                : 'bg-white/80 border-gray-200'
                }`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
                    <span className="text-4xl">🎯</span> 목표 관리
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowGoalPanel(false)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                  >
                    <span className="text-2xl">✕</span>
                  </motion.button>
                </div>
              </div>

              {/* 패널 내용 */}
              <div className="p-6">
                <Goal isDark={isDark} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// 기록 추가 모달 컴포넌트
function AddRecordModal({ type, isDark, exerciseList, foodList, onClose, onAddExercise, onAddDiet, onAddHealth }) {
  const [selectedExercise, setSelectedExercise] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedFood, setSelectedFood] = useState('');
  const [mealType, setMealType] = useState('아침');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [muscle, setMuscle] = useState('');
  const [fat, setFat] = useState('');
  const [exerciseCategory, setExerciseCategory] = useState('전체');
  const [foodCategory, setFoodCategory] = useState('전체');

  // 카테고리 목록 추출
  const exerciseCategories = ['전체', ...new Set(exerciseList.map(e => e.category).filter(Boolean))];
  const foodCategories = ['전체', ...new Set(foodList.map(f => f.category).filter(Boolean))];

  // 필터링된 목록
  const filteredExercises = exerciseCategory === '전체'
    ? exerciseList.filter(e => e.status === 'APPROVED')
    : exerciseList.filter(e => e.status === 'APPROVED' && e.category === exerciseCategory);

  const filteredFoods = foodCategory === '전체'
    ? foodList.filter(f => f.status === 'APPROVED')
    : foodList.filter(f => f.status === 'APPROVED' && f.category === foodCategory);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (type === 'exercise' && selectedExercise && duration) {
      onAddExercise(parseInt(selectedExercise), parseInt(duration));
    } else if (type === 'diet' && selectedFood && mealType) {
      onAddDiet(parseInt(selectedFood), mealType);
    } else if (type === 'health' && height && weight) {
      onAddHealth({
        height: parseFloat(height),
        weight: parseFloat(weight),
        muscle: parseFloat(muscle) || 0,
        fat: parseFloat(fat) || 0
      });
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'exercise': return '💪 운동 기록 추가';
      case 'diet': return '🍽️ 식단 기록 추가';
      case 'health': return '❤️ 건강 기록 추가';
      default: return '기록 추가';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`rounded-2xl p-8 max-w-md w-full border shadow-2xl ${isDark
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
          : 'bg-white border-gray-200'
          }`}
      >
        <h2 className="text-2xl font-bold mb-6">{getTitle()}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'exercise' && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2">카테고리</label>
                <div className="flex gap-2 flex-wrap mb-3">
                  {exerciseCategories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setExerciseCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${exerciseCategory === cat
                        ? 'bg-blue-600 text-white'
                        : isDark
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">운동 선택</label>
                <select
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-50 border-gray-300'
                    }`}
                  required
                >
                  <option value="">운동을 선택하세요</option>
                  {filteredExercises.map(exercise => (
                    <option key={exercise.exercise_id} value={exercise.exercise_id}>
                      {exercise.name} ({exercise.calories_per_hour}kcal/h)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">운동 시간 (분)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="30"
                  min="1"
                  className={`w-full p-3 rounded-lg border ${isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-50 border-gray-300'
                    }`}
                  required
                />
              </div>
            </>
          )}

          {type === 'diet' && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2">식사 시간</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-50 border-gray-300'
                    }`}
                >
                  <option value="아침">아침</option>
                  <option value="점심">점심</option>
                  <option value="저녁">저녁</option>
                  <option value="간식">간식</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">카테고리</label>
                <div className="flex gap-2 flex-wrap mb-3">
                  {foodCategories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFoodCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${foodCategory === cat
                        ? 'bg-green-600 text-white'
                        : isDark
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">음식 선택</label>
                <select
                  value={selectedFood}
                  onChange={(e) => setSelectedFood(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-50 border-gray-300'
                    }`}
                  required
                >
                  <option value="">음식을 선택하세요</option>
                  {filteredFoods.map(food => (
                    <option key={food.food_id} value={food.food_id}>
                      {food.name} ({food.calories}kcal)
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {type === 'health' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">키 (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="175"
                    step="0.1"
                    className={`w-full p-3 rounded-lg border ${isDark
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-gray-50 border-gray-300'
                      }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">체중 (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="70"
                    step="0.1"
                    className={`w-full p-3 rounded-lg border ${isDark
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-gray-50 border-gray-300'
                      }`}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">근육량 (kg)</label>
                  <input
                    type="number"
                    value={muscle}
                    onChange={(e) => setMuscle(e.target.value)}
                    placeholder="30"
                    step="0.1"
                    className={`w-full p-3 rounded-lg border ${isDark
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-gray-50 border-gray-300'
                      }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">체지방 (kg)</label>
                  <input
                    type="number"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    placeholder="15"
                    step="0.1"
                    className={`w-full p-3 rounded-lg border ${isDark
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-gray-50 border-gray-300'
                      }`}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 mt-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className={`flex-1 py-3 rounded-xl font-bold transition ${isDark
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              취소
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold transition shadow-lg"
            >
              추가
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}