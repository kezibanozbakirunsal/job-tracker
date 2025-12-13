import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApplicationsService } from '../../services/applications.service';
import { ApplicationStatus, JobApplication } from '../../models/application.model';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './applications-list.html',
  styleUrl: './applications-list.css',
})
export class ApplicationsList {

  query = signal('');
  status = signal<ApplicationStatus | 'All'>('All');

  constructor(private apps: ApplicationsService) {
    // demo seed (once per session)
    const FLAG = 'job_tracker_demo_seeded_v1';
    if (!sessionStorage.getItem(FLAG)) {
      this.apps.resetAndSeedDemo();
      sessionStorage.setItem(FLAG, '1');
    }
  }

  items = computed<JobApplication[]>(() => {
    const q = this.query().trim().toLowerCase();
    const s = this.status();

    return this.apps.list().filter(item => {
      const matchesQ =
        !q ||
        `${item.company} ${item.role} ${item.location} ${item.status}`
          .toLowerCase()
          .includes(q);

      const matchesS = s === 'All' || item.status === s;
      return matchesQ && matchesS;
    });
  });

  statuses(): ApplicationStatus[] {
    return this.apps.statuses();
  }

  remove(id: string): void {
    if (!confirm('Delete this application?')) return;
    this.apps.remove(id);
    this.query.set(this.query()); // refresh
  }

  // ✅ STATUS PILL CLASS HELPER (CLASS İÇİNDE!)
  statusClass(s: string): string {
    const v = (s || '').toLowerCase();
    if (v === 'applied') return 'applied';
    if (v === 'interview') return 'interview';
    if (v === 'rejected') return 'rejected';
    return 'default';
  }
}
