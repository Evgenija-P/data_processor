'use client';

import React, { useRef, useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { DataTable } from './components/DataTable';
import { exportToExcel, groupByAndSum, parseExcelFile } from '@/utils/helpers';
import comments from './playful-comments.json';

export default function HomePage() {
  const [files, setFiles] = useState<(File | null)[]>([null, null]);
  const [fileData, setFileData] = useState<any[][]>([[], []]);
  const [columns, setColumns] = useState<string[][]>([[], []]);
  const [showComment, setShowComment] = useState('');

  const [selectedColumns, setSelectedColumns] = useState<{
    file1Key: string;
    file2Key: string;
    file2Value: string;
  }>({
    file1Key: '',
    file2Key: '',
    file2Value: '',
  });

  const [result, setResult] = useState<any[] | null>(null);
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const handleFileUpload = async (file: File, index: number) => {
    const updatedFiles = [...files];
    updatedFiles[index] = file;
    setFiles(updatedFiles);

    const { data, columns: columnNames } = await parseExcelFile(file);

    const updatedFileData = [...fileData];
    updatedFileData[index] = data;
    setFileData(updatedFileData);

    const updatedColumns = [...columns];
    updatedColumns[index] = columnNames;
    setColumns(updatedColumns);

    // Якщо є хоча б один стовпець, вибираємо перший за замовчуванням
    if (index === 0 && columnNames.length > 0) {
      setSelectedColumns(prev => ({ ...prev, file1Key: columnNames[0] }));
    }
    if (index === 1 && columnNames.length >= 2) {
      setSelectedColumns(prev => ({
        ...prev,
        file2Key: columnNames[0],
        file2Value: columnNames[1],
      }));
    }
  };

  const getRandomComment = () => {
    const index = Math.floor(Math.random() * comments.length);
    return comments[index];
  };

  const handleProcess = () => {
    const [file1Rows, file2Rows] = fileData;

    const { file1Key, file2Key, file2Value } = selectedColumns;
    if (!file1Key || !file2Key || !file2Value) return;

    const uniqueKeys = new Set(file1Rows.map(row => row[file1Key]));
    const grouped = groupByAndSum(file2Rows, file2Key, file2Value);
    const filtered = grouped.filter(row => uniqueKeys.has(row.key));

    const resultData = filtered
      .filter(row => row.key !== undefined && row.key !== null && row.key !== '')
      .map(row => ({
        key: String(row.key),
        count: Number(row.count),
        total: Number(row.total),
      }));

    setResult(resultData);
    setShowComment(getRandomComment());
  };

  const handleExport = () => {
    if (result) {
      exportToExcel(result, 'result.xlsx');
    }
  };

  const handleReset = () => {
    setFiles([null, null]);
    setFileData([[], []]);
    setColumns([[], []]);
    setSelectedColumns({ file1Key: '', file2Key: '', file2Value: '' });
    setResult(null);

    // Очищуємо значення input через рефи, щоб браузер "побачив" новий вибір файлу
    fileInputRefs.forEach(ref => {
      if (ref.current) {
        ref.current.value = '';
      }
    });
  };

  const renderColumnSelectors = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <h3 className="mb-1 font-semibold">Файл 1: колонка з унікальними значеннями</h3>
        <select
          value={selectedColumns.file1Key}
          onChange={e => setSelectedColumns(prev => ({ ...prev, file1Key: e.target.value }))}
          className="w-full rounded border p-2"
        >
          {columns[0].map(col => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h3 className="mb-1 font-semibold">Файл 2: колонка з ключами</h3>
        <select
          value={selectedColumns.file2Key}
          onChange={e => setSelectedColumns(prev => ({ ...prev, file2Key: e.target.value }))}
          className="mb-2 w-full rounded border p-2"
        >
          {columns[1].map(col => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>

        <h3 className="mb-1 font-semibold">Файл 2: колонка з сумами</h3>
        <select
          value={selectedColumns.file2Value}
          onChange={e => setSelectedColumns(prev => ({ ...prev, file2Value: e.target.value }))}
          className="w-full rounded border p-2"
        >
          {columns[1].map(col => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-center text-2xl font-bold">Excel Data Processor</h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FileUploader
            onFileUpload={handleFileUpload}
            label="Файл 1: Унікальні значення"
            index={0}
            ref={fileInputRefs[0]}
          />
          <FileUploader
            onFileUpload={handleFileUpload}
            label="Файл 2: Дані з сумами"
            index={1}
            ref={fileInputRefs[1]}
          />
        </div>

        {columns[0].length > 0 && columns[1].length > 0 && renderColumnSelectors()}
        <div className="flex w-full flex-col gap-y-5">
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={handleProcess}
              disabled={!files[0] || !files[1]}
              className={`rounded border border-green-600 px-4 py-2 font-semibold transition ${
                !files[0] || !files[1]
                  ? 'cursor-not-allowed bg-green-400 text-white opacity-50'
                  : 'bg-green-600 text-white hover:bg-white hover:text-green-600'
              }`}
            >
              Обробити
            </button>
            <button
              onClick={handleReset}
              className="rounded border border-gray-600 bg-gray-600 px-4 py-2 font-semibold text-white transition hover:bg-white hover:text-gray-600"
            >
              Скинути
            </button>

            <button
              onClick={handleExport}
              className={`rounded border border-blue-600 bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-white hover:text-blue-600 ${result === null || undefined || result.length === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              Завантажити Excel
            </button>
          </div>
          {result && (
            <p className="mt-3 text-center text-2xl font-semibold text-green-700">{showComment}</p>
          )}
        </div>

        {result && <DataTable data={result} title="Результати порівняння" />}
      </div>
    </main>
  );
}
