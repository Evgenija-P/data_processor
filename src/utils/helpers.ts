// app/utils/helpers.ts
import * as XLSX from 'xlsx';

// export const parseExcelFile = async (file: File): Promise<{
//   data: Record<string, any>[],
//   columns: string[]
// }> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target?.result as ArrayBuffer);
//       const workbook = XLSX.read(data, { type: "array" });
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

//       const headers = jsonData[0] as string[];
//       const rows = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];

//       resolve({ data: rows, columns: headers });
//     };
//     reader.onerror = reject;
//     reader.readAsArrayBuffer(file);
//   });
// };
//

export const parseExcelFile = async (
  file: File
): Promise<{
  data: Record<string, any>[];
  columns: string[];
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Читаємо всі дані у вигляді масиву масивів
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (!jsonData.length) {
          throw new Error('Файл порожній або має неправильну структуру.');
        }

        // Беремо перший рядок як заголовки
        const rawHeaders = jsonData[0] as string[];

        // Чистимо заголовки
        const headers = rawHeaders.map(h => (h ?? '').toString().trim()).filter(h => h !== '');

        // Тіло таблиці (без заголовка)
        const bodyRows = jsonData.slice(1);

        // Перетворюємо кожен рядок у об'єкт
        const cleanedData: Record<string, any>[] = bodyRows.map(row => {
          const rowObj: Record<string, any> = {};
          headers.forEach((header, index) => {
            const rawValue = row[index];

            if (typeof rawValue === 'string') {
              // Чистимо текст від пробілів, ком тощо
              const cleaned = rawValue.replace(/\s/g, '').replace(',', '.');
              const parsed = parseFloat(cleaned);
              rowObj[header] = isNaN(parsed) ? rawValue : parsed;
            } else {
              rowObj[header] = rawValue;
            }
          });
          return rowObj;
        });

        resolve({ data: cleanedData, columns: headers });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const groupByAndSum = (
  data: Record<string, any>[],
  groupKey: string,
  sumKey: string
): { key: string; total: number; count: number }[] => {
  const map = new Map<string, { total: number; count: number }>();

  for (const item of data) {
    const key = item[groupKey];
    const value = parseFloat(item[sumKey]) || 0;
    if (!map.has(key)) {
      map.set(key, { total: value, count: 1 });
    } else {
      const existing = map.get(key)!;
      existing.total += value;
      existing.count += 1;
    }
  }

  return Array.from(map.entries()).map(([key, val]) => ({
    key,
    total: val.total,
    count: val.count,
  }));
};

export const exportToExcel = (
  data: { key: string; total: number; count: number }[],
  fileName: string
) => {
  const ws = XLSX.utils.json_to_sheet(
    data.map(row => ({
      Назва: row.key,
      Сума: row.total,
      Кількість: row.count,
    }))
  );

  // Встановлюємо ширину колонок (під текст)
  ws['!cols'] = [
    { width: 50 }, // Назва
    { width: 15 }, // Сума
    { width: 15 }, // Кількість
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Results');
  XLSX.writeFile(wb, fileName);
};
