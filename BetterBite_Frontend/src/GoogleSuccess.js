import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function GoogleSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isHandled, setIsHandled] = useState(false);

  useEffect(() => {
    if (isHandled) return;

    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");
    const isNewUser = searchParams.get("isNewUser") === "true";

    console.log("🔍 Google login callback data:", {
      token: token ? token.substring(0, 20) + "..." : null,
      email,
      userId,
      isNewUser,
    });

    if (token && email && userId) {
      try {
        const parts = token.split(".");
        if (parts.length !== 3) throw new Error("Token format tidak valid");

        const payload = JSON.parse(atob(parts[1]));
        console.log("🔍 Token payload:", payload);

        const tokenUserId = payload.userId || payload.id || payload.user_id;
        if (!tokenUserId) throw new Error("Token tidak mengandung User ID");

        const currentTime = Date.now() / 1000;
        if (payload.exp && payload.exp < currentTime)
          throw new Error("Token sudah expired");

        localStorage.clear();
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("userId", userId);

        console.log("✅ Google login data berhasil disimpan:", {
          tokenUserId,
          email,
          userId,
          expires: new Date(payload.exp * 1000),
        });

        setIsHandled(true); // cegah pemrosesan ulang

        setTimeout(() => {
          if (isNewUser) {
            console.log("🔄 Redirecting to form-personality (new user)");
            navigate("/form-personality");
          } else {
            console.log("🔄 Redirecting to dashboard (existing user)");
            navigate("/dashboard");
          }
        }, 500);
      } catch (error) {
        console.error("❌ Error processing Google login:", error);
        alert("Login Google gagal: " + error.message);
        navigate("/login");
      }
    } else {
      console.error("❌ Google login gagal: parameter tidak lengkap", {
        hasToken: !!token,
        hasEmail: !!email,
        hasUserId: !!userId,
      });
      alert("Login Google gagal: Data tidak lengkap");
      navigate("/login");
    }
  }, [navigate, searchParams, isHandled]);


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h3>Memproses login Google...</h3>
        <p>Mohon tunggu sebentar</p>
      </div>
    </div>
  );
}

export default GoogleSuccessPage;
