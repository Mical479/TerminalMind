"use client";

import React, { useState, useEffect } from "react";

interface User {
  id: string;
  nickname: string;
  figure?: string;
  gender?: string;
}

interface QQLoginButtonProps {
  className?: string;
  redirectAfterLogin?: string;
  showUsername?: boolean;
}

export default function QQLoginButton({
  className = "",
  redirectAfterLogin,
  showUsername = true
}: QQLoginButtonProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      if (data.loggedIn && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to check session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // Save current URL for redirect after login
    if (typeof window !== 'undefined' && redirectAfterLogin) {
      document.cookie = `tm_auth_redirect=${encodeURIComponent(redirectAfterLogin)}; Path=/; SameSite=Lax; Max-Age=600`;
    }
    window.location.href = '/api/auth/qq';
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redirect: '/' })
      });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className={`qq-login-container ${className}`}>
        <div className="qq-login-loading">加载中...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className={`qq-login-container logged-in ${className}`}>
        <div className="qq-user-info">
          {user.figure && (
            <img
              src={user.figure}
              alt={user.nickname}
              className="qq-avatar"
            />
          )}
          {showUsername && (
            <span className="qq-username">{user.nickname}</span>
          )}
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="qq-logout-btn"
        >
          {loggingOut ? '退出中...' : '退出'}
        </button>
      </div>
    );
  }

  return (
    <div className={`qq-login-container ${className}`}>
      <button onClick={handleLogin} className="qq-login-btn">
        <svg className="qq-icon" viewBox="0 0 24 24" width="20" height="20">
          <path fill="#12B7F5" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm3-3.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
        QQ 登录
      </button>
    </div>
  );
}
