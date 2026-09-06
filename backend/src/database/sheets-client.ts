import { google, sheets_v4 } from 'googleapis';
import { InternalError } from '../errors/InternalError';

export type SheetValue = string | number | boolean | null;
export type SheetRow = Record<string, SheetValue>;
export interface IndexedRow {
  rowIndex: number;
  record: SheetRow;
}

export interface SheetsClientConfig {
  serviceAccountEmail: string;
  privateKey: string;
  spreadsheetId: string;
}

export class SheetsClient {
  private readonly sheets: sheets_v4.Sheets;
  private readonly spreadsheetId: string;
  private cache: Map<string, { data: IndexedRow[]; expiresAt: number }> =
    new Map();
  private headersCache: Map<string, { data: string[]; expiresAt: number }> =
    new Map();
  private readonly cacheTtlMs: number;

  constructor(config: SheetsClientConfig, cacheTtlMs = 30_000) {
    const auth = new google.auth.JWT({
      email: config.serviceAccountEmail,
      key: config.privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = config.spreadsheetId;
    this.cacheTtlMs = cacheTtlMs;
  }

  getSpreadsheetId(): string {
    return this.spreadsheetId;
  }

  async isHealthy(): Promise<boolean> {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });
      return !!response.data.spreadsheetId;
    } catch {
      return false;
    }
  }

  private getCacheKey(sheetName: string): string {
    return `${this.spreadsheetId}:${sheetName}`;
  }

  private getCached(sheetName: string): IndexedRow[] | null {
    const entry = this.cache.get(this.getCacheKey(sheetName));
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(this.getCacheKey(sheetName));
      return null;
    }
    return entry.data;
  }

  private setCache(sheetName: string, data: IndexedRow[]): void {
    this.cache.set(this.getCacheKey(sheetName), {
      data,
      expiresAt: Date.now() + this.cacheTtlMs,
    });
  }

  private dropCache(sheetName: string): void {
    this.cache.delete(this.getCacheKey(sheetName));
    this.headersCache.delete(this.getCacheKey(sheetName));
  }

  dropCacheAll(): void {
    this.cache.clear();
    this.headersCache.clear();
  }

  async getHeaders(sheetName: string): Promise<string[]> {
    const cacheKey = this.getCacheKey(sheetName);
    const cached = this.headersCache.get(cacheKey);
    if (cached && Date.now() <= cached.expiresAt) return cached.data;

    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!A1:Z1`,
      valueRenderOption: 'UNFORMATTED_VALUE',
    });
    const values = response.data.values;
    const headers = values?.[0]?.map((cell: SheetValue) => String(cell)) ?? [];
    this.headersCache.set(cacheKey, {
      data: headers,
      expiresAt: Date.now() + this.cacheTtlMs,
    });
    return headers;
  }

  async readSheet(sheetName: string): Promise<IndexedRow[]> {
    const cached = this.getCached(sheetName);
    if (cached) return cached;

    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!A1:Z10000`,
      valueRenderOption: 'UNFORMATTED_VALUE',
    });

    const values = response.data.values;
    if (!values || values.length === 0) {
      this.setCache(sheetName, []);
      return [];
    }

    const [headerRow, ...dataRows] = values;
    const headers: string[] = headerRow.map((cell: SheetValue) => String(cell));

    const indexed: IndexedRow[] = dataRows.map((row, idx) => {
      const record: SheetRow = {};
      headers.forEach((col, i) => {
        record[col] = row[i] ?? null;
      });
      return { rowIndex: idx + 2, record }; // +2: pula header (linha 1) + index 0-based
    });

    this.setCache(sheetName, indexed);
    return indexed;
  }

  async appendRow(
    sheetName: string,
    values: SheetValue[],
  ): Promise<void> {
    const response = await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        majorDimension: 'ROWS',
        values: [values],
      },
    });
    if (!response.data.updates) {
      throw new InternalError('Falha ao inserir registro no Google Sheets');
    }
    this.dropCache(sheetName);
  }

  async updateRow(
    sheetName: string,
    rowNumber: number,
    values: SheetValue[],
  ): Promise<void> {
    const response = await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!A${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        majorDimension: 'ROWS',
        values: [values],
      },
    });
    if (!response.data.updatedRows) {
      throw new InternalError('Falha ao atualizar registro no Google Sheets');
    }
    this.dropCache(sheetName);
  }

  async deleteRow(
    sheetName: string,
    sheetId: number,
    rowNumber: number,
  ): Promise<void> {
    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: 'ROWS',
                startIndex: rowNumber - 1,
                endIndex: rowNumber,
              },
            },
          },
        ],
      },
    });
    this.dropCache(sheetName);
  }

  async getSheetId(sheetName: string): Promise<number | null> {
    const response = await this.sheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId,
      ranges: [sheetName],
    });
    const sheet = response.data.sheets?.find(
      (s) => s.properties?.title === sheetName,
    );
    return sheet?.properties?.sheetId ?? null;
  }
}