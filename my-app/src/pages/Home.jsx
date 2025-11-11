export default function Home() {
  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* ✅ 배경 동영상 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      >
        <source src="/videos/gym.mp4" type="video/mp4" />
        당신의 브라우저는 video 태그를 지원하지 않습니다.
      </video>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-8xl font-extrabold mb-8 tracking-tight drop-shadow-lg">
          HSU GYM
        </h1>

        <button className="bg-emerald-200 text-black font-semibold px-8 py-3 rounded-md shadow-md hover:bg-emerald-300 transition">
          나의 포인트 현황 보러가기
        </button>
      </div> 

      {/* 하단 고정 배너 */}
      <div className="absolute bottom-0 left-0 w-full bg-blue-700 text-white py-3 flex justify-around text-sm font-semibold">
        <span>전체 포인트 수령 &gt; 100p</span>
        <span>즐겨라, 배우라, 이겨내라!</span>
        <span>오늘 몇시-몇시 수업</span>
        <span>이번 달 전체 포인트 수령 &gt; 100p</span>
      </div>
    </div>
  );
}