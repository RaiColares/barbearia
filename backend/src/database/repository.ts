import { SheetsClient, SheetRow, IndexedRow } from './sheets-client';

export interface InsertInput {
  [key: string]: string | number | boolean | null;
}

export interface FindResult {
  rowIndex: number;
  record: SheetRow;
}

export abstract class SheetsRepository {
  protected abstract readonly sheetName: string;
  protected readonly client: SheetsClient;

  constructor(client: SheetsClient) {
    this.client = client;
  }

  protected async findAllIndexed(): Promise<IndexedRow[]> {
    return this.client.readSheet(this.sheetName);
  }

  protected async findAll(): Promise<SheetRow[]> {
    return (await this.findAllIndexed()).map((r) => r.record);
  }

  protected async findBy(
    predicate: (row: SheetRow) => boolean,
  ): Promise<FindResult | null> {
    const rows = await this.findAllIndexed();
    const match = rows.find((r) => predicate(r.record));
    return match ? { rowIndex: match.rowIndex, record: match.record } : null;
  }

  protected async findManyBy(
    predicate: (row: SheetRow) => boolean,
  ): Promise<SheetRow[]> {
    return (await this.findAllIndexed())
      .filter((r) => predicate(r.record))
      .map((r) => r.record);
  }

  protected async getHeader(): Promise<string[]> {
    return this.client.getHeaders(this.sheetName);
  }

  protected async insert(values: InsertInput): Promise<void> {
    const header = await this.getHeader();
    const rowValues = header.map((col) => values[col] ?? null);
    await this.client.appendRow(this.sheetName, rowValues);
  }

  protected async updateByIndex(
    rowIndex: number,
    updates: InsertInput,
  ): Promise<void> {
    const header = await this.getHeader();
    const current = (await this.client.readSheet(this.sheetName)).find(
      (r) => r.rowIndex === rowIndex,
    );
    const base: InsertInput = current ? { ...current.record } : {};
    const merged = { ...base, ...updates };
    const rowValues = header.map((col) => merged[col] ?? null);
    await this.client.updateRow(this.sheetName, rowIndex, rowValues);
  }

  protected async updateOne(
    predicate: (row: SheetRow) => boolean,
    updates: InsertInput,
  ): Promise<boolean> {
    const match = await this.findBy(predicate);
    if (!match) return false;
    await this.updateByIndex(match.rowIndex, updates);
    return true;
  }

  protected async deleteOne(
    predicate: (row: SheetRow) => boolean,
  ): Promise<boolean> {
    const match = await this.findBy(predicate);
    if (!match) return false;
    const sheetId = await this.client.getSheetId(this.sheetName);
    if (sheetId === null) return false;
    await this.client.deleteRow(this.sheetName, sheetId, match.rowIndex);
    return true;
  }
}