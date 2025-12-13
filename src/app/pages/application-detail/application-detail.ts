import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApplicationsService } from '../../services/applications.service';
import { JobApplication } from '../../models/application.model';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './application-detail.html',
  styleUrl: './application-detail.css',
})
export class ApplicationDetail {
  item: JobApplication | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apps: ApplicationsService
  ) {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.item = this.apps.getById(id);
    if (!this.item) this.router.navigateByUrl('/applications');
  }

  remove(): void {
    if (!this.item) return;
    if (!confirm('Delete this application?')) return;
    this.apps.remove(this.item.id);
    this.router.navigateByUrl('/applications');
  }
}
