
import React, { useState } from 'react';

interface FileUploaderProps {
  onDataReady: (text?: string, fileData?: { base64: string, mimeType: string }) => void;
  isLoading: boolean;
}

declare const mammoth: any;

const FileUploader: React.FC<FileUploaderProps> = ({ onDataReady, isLoading }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    setError(null);

    try {
      if (fileName.endsWith('.docx')) {
        // 使用 mammoth 提取文本
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        if (!result.value.trim()) throw new Error("文档内容为空");
        onDataReady(result.value);
      } 
      else if (fileName.endsWith('.pdf')) {
        // PDF 直接发给 Gemini
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = (e.target?.result as string).split(',')[1];
          onDataReady(undefined, { base64, mimeType: 'application/pdf' });
        };
        reader.readAsDataURL(file);
      }
      else if (fileName.endsWith('.txt')) {
        const text = await file.text();
        onDataReady(text);
      }
      else if (fileName.endsWith('.doc')) {
        // 旧版 .doc 处理
        setError("提示：旧版 .doc 格式兼容性较差，建议您在 Word 中将其“另存为” .docx 或 .pdf 后再上传。");
        // 尝试作为文本读取（虽然可能乱码，但 AI 有时能救回来）
        const text = await file.text();
        onDataReady(text);
      }
      else {
        setError("不支持的文件格式。请上传 .docx, .pdf 或 .txt。");
      }
    } catch (err: any) {
      setError("文件读取失败: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-blue-200 rounded-3xl bg-white shadow-xl transition-all hover:border-blue-400 hover:shadow-2xl max-w-xl w-full">
      <div className="mb-6 p-5 bg-blue-50 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">上传文档</h2>
      <p className="text-gray-500 text-center mb-8 px-4 leading-relaxed">
        支持 <span className="font-bold text-blue-600">.docx / .pdf / .txt</span><br/>
        旧版 .doc 建议转换为 .docx 以获得最佳效果。
      </p>
      
      <label className={`relative flex items-center justify-center px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl cursor-pointer transition-all hover:bg-blue-700 active:scale-95 shadow-lg hover:shadow-blue-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <span>{isLoading ? 'AI 正在解析题目...' : '选择文件'}</span>
        <input 
          type="file" 
          className="hidden" 
          accept=".doc,.docx,.pdf,.txt" 
          onChange={handleFileChange} 
          disabled={isLoading}
        />
      </label>

      {error && (
        <div className="mt-6 p-4 bg-orange-50 text-orange-700 text-sm rounded-xl border border-orange-100 animate-in fade-in slide-in-from-top-2 duration-300">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
