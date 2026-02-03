import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotification = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={1500}
      hideProgressBar={true}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={false}
      closeButton={false}
      theme="dark"
      toastClassName="!bg-black/80 !backdrop-blur-xl !border !border-white/10 !rounded-full !shadow-[0_8px_30px_rgb(0,0,0,0.12)] !p-1.5 !min-h-0 !mb-4 !w-auto !max-w-xs"
      bodyClassName="!text-sm !font-medium !text-white !px-4 !py-2 !m-0 !flex !items-center !gap-3"
      icon={({ type }) => {
         // Custom minimal dots for icons
         if (type === 'success') return <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] shrink-0" />;
         if (type === 'error') return <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] shrink-0" />;
         return <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] shrink-0" />;
      }}
    />
  );
};

export default ToastNotification;
