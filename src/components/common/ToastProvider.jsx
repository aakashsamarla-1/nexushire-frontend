import React from "react";
import { Toaster, toast } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          padding: '16px 20px',
          borderRadius: '12px',
          fontSize: '14px',
          maxWidth: '400px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        },
        success: {
          style: { background: '#10b981' },
          iconTheme: { primary: '#fff', secondary: '#10b981' },
        },
        error: {
          style: { background: '#ef4444' },
          iconTheme: { primary: '#fff', secondary: '#ef4444' },
        },
        loading: {
          style: { background: '#3b82f6' },
          iconTheme: { primary: '#fff', secondary: '#3b82f6' },
        },
      }}
    />
  );
};

export const showToast = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  loading: (msg) => toast.loading(msg),
  info: (msg) => toast(msg, { icon: 'ℹ️' }),
  dismiss: () => toast.dismiss(),
};
