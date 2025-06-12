'use client';

import React from 'react';

interface Row {
  key: string;
  total: number;
  count: number;
}

interface DataTableProps {
  data: Row[];
  title: string;
}

export const DataTable: React.FC<DataTableProps> = ({ data, title }) => {
  return (
    <div className="overflow-x-auto rounded shadow">
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <table className="min-w-full border border-gray-200 bg-white text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Значення</th>
            {/* <th className="px-4 py-2 border">Кількість</th> */}
            <th className="border px-4 py-2">Сума</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{row.key}</td>
              {/* <td className="border px-4 py-2 text-center">{row.count}</td> */}
              <td className="border px-4 py-2 text-right">{row.total.toFixed(2)}</td>
            </tr>
          ))}
          <tr className="bg-gray-100 font-bold">
            <td className="border px-4 py-2">Разом</td>
            {/* <td className="border px-4 py-2 text-center">
              {data.reduce((sum, row) => sum + row.count, 0)}
            </td> */}
            <td className="border px-4 py-2 text-right">
              {data.reduce((sum, row) => sum + row.total, 0).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
