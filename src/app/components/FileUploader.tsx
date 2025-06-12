import React, { forwardRef } from 'react';

interface FileUploaderProps {
  label: string;
  index: number;
  onFileUpload: (file: File, index: number) => void;
}

export const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(
  ({ label, index, onFileUpload }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onFileUpload(e.target.files[0], index);
      }
    };

    return (
      <div>
        <label className="mb-1 block font-medium">{label}</label>
        <input
          ref={ref}
          type="file"
          onChange={handleChange}
          className="w-full rounded border p-2"
          accept=".xlsx, .xls"
        />
      </div>
    );
  }
);
