import * as XLSX from 'xlsx';

export interface ParsedRow {
  key: string;
  amount: number;
}

export interface ResultRow {
  key: string;
  totalAmount: number;
  count: number;
}

export function parseFirstFile(file: File): Promise<Set<string>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 });

      const uniqueValues = new Set<string>();

      rows.forEach(row => {
        const value = String(row[0]).trim();
        if (value) {
          uniqueValues.add(value);
        }
      });

      resolve(uniqueValues);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function parseSecondFile(file: File, validKeys: Set<string>): Promise<ResultRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 });

      const summaryMap = new Map<string, { totalAmount: number; count: number }>();

      rows.forEach(row => {
        const key = String(row[0]).trim();
        const amount = parseFloat(row[1]);

        if (validKeys.has(key) && !isNaN(amount)) {
          const current = summaryMap.get(key) || { totalAmount: 0, count: 0 };
          current.totalAmount += amount;
          current.count += 1;
          summaryMap.set(key, current);
        }
      });

      const result: ResultRow[] = Array.from(summaryMap.entries()).map(([key, value]) => ({
        key,
        totalAmount: value.totalAmount,
        count: value.count,
      }));

      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
