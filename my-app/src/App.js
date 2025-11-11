import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Notice from "./pages/Notice";
import Mentoring from "./pages/mentoring/Mentoring";
import Guide from "./pages/Guide";
import MyPage from "./pages/MyPage";
import { MatchProvider } from "./pages/mentoring/MatchContext";
import { Toaster } from "react-hot-toast"; // ✅ 추가

function App() {
  return (
    <Router>
      <MatchProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/mentoring" element={<Mentoring />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/mypage" element={<MyPage />} />
          </Routes>

          {/* ✅ 전역 Toast 알림 컨테이너 */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#333",
                color: "#fff",
                borderRadius: "10px",
                padding: "10px 16px",
              },
              success: {
                iconTheme: { primary: "#4ade80", secondary: "#333" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#333" },
              },
            }}
          />
        </div>
      </MatchProvider>
    </Router>
  );
}

export default App;