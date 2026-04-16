import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/api/user";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit states
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  // Form values
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordOtp, setPasswordOtp] = useState("");
  const [passwordOtpSent, setPasswordOtpSent] = useState(false);

  // Feedback
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }
  const [btnLoading, setBtnLoading] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API}/dashboard`, { headers });
      setUser(res.data.user);
      setNewName(res.data.user.name);
    } catch {
      showToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUser(); }, []);

  // ── Name ──────────────────────────────────────────
  const handleUpdateName = async () => {
    setBtnLoading("name");
    try {
      const res = await axios.put(`${API}/update-name`, { name: newName }, { headers });
      setUser(res.data.user);
      setEditName(false);
      showToast("Name updated successfully! ✨");
    } catch (e) {
      showToast(e.response?.data?.message || "Failed to update name", "error");
    } finally { setBtnLoading(""); }
  };

  // ── Email ─────────────────────────────────────────
  const handleRequestEmailOtp = async () => {
    setBtnLoading("emailOtp");
    try {
      await axios.post(`${API}/request-email-change`, { newEmail }, { headers });
      setEmailOtpSent(true);
      showToast("OTP sent to your new email 📬");
    } catch (e) {
      showToast(e.response?.data?.message || "Failed to send OTP", "error");
    } finally { setBtnLoading(""); }
  };

  const handleVerifyEmail = async () => {
    setBtnLoading("emailVerify");
    try {
      const res = await axios.put(`${API}/verify-email-change`, { otp: emailOtp }, { headers });
      setUser(res.data.user);
      setEditEmail(false);
      setEmailOtpSent(false);
      setNewEmail("");
      setEmailOtp("");
      showToast("Email updated successfully! 🎉");
    } catch (e) {
      showToast(e.response?.data?.message || "Invalid OTP", "error");
    } finally { setBtnLoading(""); }
  };

  // ── Password ──────────────────────────────────────
  const handleRequestPasswordOtp = async () => {
    setBtnLoading("passwordOtp");
    try {
      await axios.post(`${API}/request-password-change`, {}, { headers });
      setPasswordOtpSent(true);
      showToast("OTP sent to your registered email 🔐");
    } catch (e) {
      showToast(e.response?.data?.message || "Failed to send OTP", "error");
    } finally { setBtnLoading(""); }
  };

  const handleVerifyPassword = async () => {
    setBtnLoading("passwordVerify");
    try {
      await axios.put(`${API}/verify-password-change`, { otp: passwordOtp, newPassword }, { headers });
      setEditPassword(false);
      setPasswordOtpSent(false);
      setNewPassword("");
      setPasswordOtp("");
      showToast("Password updated successfully! 🔒");
    } catch (e) {
      showToast(e.response?.data?.message || "Invalid OTP", "error");
    } finally { setBtnLoading(""); }
  };

  const cancelAll = () => {
    setEditName(false); setEditEmail(false); setEditPassword(false);
    setEmailOtpSent(false); setPasswordOtpSent(false);
    setEmailOtp(""); setPasswordOtp(""); setNewPassword("");
  };

  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 text-sm font-mono">loading profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-6 py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        .glass {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
        }

        .glow-ring {
          box-shadow: 0 0 0 1px rgba(139,92,246,0.3), 0 0 30px rgba(139,92,246,0.15);
        }

        .input-field {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 10px 14px;
          color: white;
          font-size: 14px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .input-field:focus {
          border-color: rgba(139,92,246,0.6);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
        }

        .input-field::placeholder { color: rgba(255,255,255,0.2); }

        .btn-primary {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
        }

        .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .btn-ghost {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 10px 20px;
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .btn-ghost:hover {
          background: rgba(255,255,255,0.08);
          color: white;
        }

        .btn-outline {
          background: transparent;
          border: 1px solid rgba(139,92,246,0.3);
          border-radius: 10px;
          padding: 8px 16px;
          color: #a78bfa;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .btn-outline:hover {
          background: rgba(139,92,246,0.1);
          border-color: rgba(139,92,246,0.6);
          color: #c4b5fd;
        }

        .edit-panel {
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s;
        }

        .edit-panel.open { max-height: 400px; opacity: 1; }
        .edit-panel.closed { max-height: 0; opacity: 0; }

        .section-card {
          border-radius: 18px;
          padding: 24px;
          transition: border-color 0.2s;
        }

        .section-card:hover { border-color: rgba(255,255,255,0.12) !important; }

        .accent-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
          display: inline-block;
        }

        .toast {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 999;
          padding: 14px 20px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 500;
          animation: slideUp 0.3s ease;
          max-width: 320px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .toast.success {
          background: rgba(16,185,129,0.12);
          border: 1px solid rgba(16,185,129,0.3);
          color: #6ee7b7;
        }

        .toast.error {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          color: #fca5a5;
        }

        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .mono { font-family: 'DM Mono', monospace; }

        .gradient-text {
          background: linear-gradient(135deg, #a78bfa, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .avatar-glow {
          box-shadow: 0 0 0 1px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.2), inset 0 0 20px rgba(139,92,246,0.1);
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.message}
        </div>
      )}

      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>
            Account Settings
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
            Your <span className="gradient-text">Profile</span>
          </h1>
        </div>

        {/* Top Card — Avatar + Status */}
        <div className="glass section-card" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 24 }}>
          {/* Avatar */}
          <div className="avatar-glow" style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "linear-gradient(135deg, #4c1d95, #1e1b4b)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: "#c4b5fd" }}>{avatarLetter}</span>
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em" }}>{user?.name || "User"}</h2>
            <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.35)", fontSize: 14 }}>{user?.email}</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, padding: "8px 14px" }}>
            <span className="accent-dot" />
            <span style={{ color: "#6ee7b7", fontSize: 13, fontWeight: 600 }}>Active</span>
          </div>
        </div>

        {/* ── Name Section ─────────────────────────────── */}
        <div className="glass section-card" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>Full Name</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{user?.name || "—"}</p>
            </div>
            <button className="btn-outline" onClick={() => { setEditName(!editName); cancelAll(); setEditName(true); setNewName(user?.name || ""); }}>
              {editName ? "Cancel" : "Edit"}
            </button>
          </div>

          {/* Inline Edit Panel */}
          <div className={`edit-panel ${editName ? "open" : "closed"}`}>
            <div style={{ paddingTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                className="input-field"
                placeholder="Enter new name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-primary" onClick={handleUpdateName} disabled={btnLoading === "name"}>
                  {btnLoading === "name" ? "Saving..." : "Save Name"}
                </button>
                <button className="btn-ghost" onClick={() => setEditName(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Email Section ─────────────────────────────── */}
        <div className="glass section-card" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>Email Address</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{user?.email || "—"}</p>
            </div>
            <button className="btn-outline" onClick={() => { cancelAll(); setEditEmail(true); }}>
              {editEmail ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className={`edit-panel ${editEmail ? "open" : "closed"}`}>
            <div style={{ paddingTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              {!emailOtpSent ? (
                <>
                  <input
                    className="input-field"
                    placeholder="Enter new email address"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                  />
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-primary" onClick={handleRequestEmailOtp} disabled={btnLoading === "emailOtp"}>
                      {btnLoading === "emailOtp" ? "Sending OTP..." : "Send OTP"}
                    </button>
                    <button className="btn-ghost" onClick={() => setEditEmail(false)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                    OTP sent to <span style={{ color: "#a78bfa" }}>{newEmail}</span> — check your inbox 📬
                  </p>
                  <input
                    className="input-field mono"
                    placeholder="Enter 6-digit OTP"
                    value={emailOtp}
                    onChange={e => setEmailOtp(e.target.value)}
                    maxLength={6}
                  />
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-primary" onClick={handleVerifyEmail} disabled={btnLoading === "emailVerify"}>
                      {btnLoading === "emailVerify" ? "Verifying..." : "Verify & Update"}
                    </button>
                    <button className="btn-ghost" onClick={() => { setEmailOtpSent(false); setEmailOtp(""); }}>
                      Resend OTP
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Password Section ──────────────────────────── */}
        <div className="glass section-card" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>Password</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)" }}>••••••••••</p>
            </div>
            <button className="btn-outline" onClick={() => { cancelAll(); setEditPassword(true); }}>
              {editPassword ? "Cancel" : "Change"}
            </button>
          </div>

          <div className={`edit-panel ${editPassword ? "open" : "closed"}`}>
            <div style={{ paddingTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              {!passwordOtpSent ? (
                <>
                  <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                    We'll send a verification OTP to <span style={{ color: "#a78bfa" }}>{user?.email}</span> to confirm it's you.
                  </p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-primary" onClick={handleRequestPasswordOtp} disabled={btnLoading === "passwordOtp"}>
                      {btnLoading === "passwordOtp" ? "Sending OTP..." : "Send OTP"}
                    </button>
                    <button className="btn-ghost" onClick={() => setEditPassword(false)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                    OTP sent to <span style={{ color: "#a78bfa" }}>{user?.email}</span> 🔐
                  </p>
                  <input
                    className="input-field mono"
                    placeholder="Enter 6-digit OTP"
                    value={passwordOtp}
                    onChange={e => setPasswordOtp(e.target.value)}
                    maxLength={6}
                  />
                  <input
                    className="input-field"
                    type="password"
                    placeholder="Enter new password (min 6 chars)"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-primary" onClick={handleVerifyPassword} disabled={btnLoading === "passwordVerify"}>
                      {btnLoading === "passwordVerify" ? "Updating..." : "Update Password"}
                    </button>
                    <button className="btn-ghost" onClick={() => { setPasswordOtpSent(false); setPasswordOtp(""); }}>
                      Resend OTP
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.15)", marginTop: 32, fontFamily: "'DM Mono', monospace" }}>
          all changes are verified & secured with OTP
        </p>
      </div>
    </div>
  );
};

export default Profile;