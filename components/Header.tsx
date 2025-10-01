import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-white bg-blue-600 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.783 2.05s.489-.47 1.178-.029c.689.44.689 1.472.689 1.472s-.878 3.393-1.802 4.425c-.924 1.031-2.13 1.583-2.13 1.583s1.206.552 2.13 1.583c.924 1.032 1.802 4.425 1.802 4.425s0 1.032-.689 1.472c-.689.44-1.178-.029-1.178-.029s-1.11-1.353-2.435-1.353c-1.325 0-2.435 1.353-2.435 1.353s-.489.47-1.178.029c-.689-.44-.689-1.472-.689-1.472s.878-3.393 1.802-4.425C9.255 11.082 10.46 10.53 10.46 10.53s-1.206-.552-2.13-1.583C7.406 7.915 6.528 4.522 6.528 4.522s0-1.032.689-1.472c.689-.44 1.178.029 1.178.029s1.11 1.353 2.435 1.353c1.325 0 2.435-1.353 2.435-1.353z"></path>
            </svg>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            AI 中文智能测验
          </h1>
        </div>
        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            Gemini 2.5 Flash
        </span>
      </div>
    </header>
  );
};
