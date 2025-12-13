import { Injectable, signal } from '@angular/core';
import { ApplicationStatus, JobApplication } from '../models/application.model';

type NewApplication = Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateApplication = Partial<NewApplication>;

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private storageKey = 'job-tracker.apps.v1';
  private itemsSig = signal<JobApplication[]>(this.read());

  constructor() {
    this.seedIfEmpty();
  }

  // -------- Public API --------

  list(): JobApplication[] {
    return this.itemsSig();
  }

  statuses(): ApplicationStatus[] {
    return ['Applied', 'Interview', 'Offer', 'Rejected'];
  }

  getById(id: string): JobApplication | undefined {
    return this.itemsSig().find(x => x.id === id);
  }

  create(data: NewApplication): JobApplication {
    const now = Date.now(); // number ✅
    const item: JobApplication = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      company: data.company,
      role: data.role,
      location: data.location,
      status: data.status,
      appliedDate: data.appliedDate ?? null,
      notes: data.notes ?? null,
    };

    const next = [item, ...this.itemsSig()];
    this.write(next);
    return item;
  }

  update(id: string, patch: UpdateApplication): JobApplication | undefined {
    const now = Date.now(); // number ✅

    const next: JobApplication[] = this.itemsSig().map(x => {
      if (x.id !== id) return x;

      return {
        ...x,
        company: patch.company ?? x.company,
        role: patch.role ?? x.role,
        location: patch.location ?? x.location,
        status: patch.status ?? x.status,
        appliedDate: patch.appliedDate ?? x.appliedDate,
        notes: patch.notes ?? x.notes,
        updatedAt: now,
      };
    });

    this.write(next);
    return next.find(x => x.id === id);
  }

  remove(id: string): void {
    const next = this.itemsSig().filter(x => x.id !== id);
    this.write(next);
  }

  clear(): void {
    this.write([]);
  }

  // ✅ Some screens/components call this
  resetAndSeedDemo(): void {
    this.clear();
    this.seedIfEmpty();
  }

  // -------- Storage helpers --------

  private read(): JobApplication[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as JobApplication[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private write(items: JobApplication[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.itemsSig.set(items);
  }

  // -------- Seed (PUBLIC because app.ts calls it) --------

  public seedIfEmpty(): void {
    const items = this.read();
    if (items.length) return;

    const iso = (d: Date) => d.toISOString().slice(0, 10);
    const day = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

   const seeds: NewApplication[] = [
  {
    company: 'Northstar Labs',
    role: 'Junior Developer (Apprenticeship)',
    location: 'Manchester',
    status: 'Applied',
    appliedDate: iso(day(7)),
    notes: 'Follow up next week.',
  },
  {
    company: 'River & Co.',
    role: 'Admin Officer',
    location: 'Greater Manchester',
    status: 'Interview',
    appliedDate: iso(day(14)),
    notes: 'Prepare STAR examples.',
  },
  {
    company: 'BrightBridge Tech',
    role: 'Data Engineer',
    location: 'Manchester',
    status: 'Rejected',
    appliedDate: iso(day(30)),
    notes: 'Ask for feedback.',
  },
];
for (const s of seeds) this.create(s);
  }
}