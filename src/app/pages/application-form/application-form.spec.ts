import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApplicationsService } from '../../services/applications.service';
import { ApplicationStatus } from '../../models/application.model';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './application-form.html',
  styleUrl: './application-form.css',
})
export class ApplicationForm implements OnInit {
  id: string | null = null;
  statuses: ApplicationStatus[] = [];

  form = this.fb.group({
    company: ['', [Validators.required, Validators.minLength(2)]],
    role: ['', [Validators.required, Validators.minLength(2)]],
    location: ['', [Validators.required]],
    status: ['Applied' as ApplicationStatus, [Validators.required]],
    appliedDate: [new Date().toISOString().slice(0, 10), [Validators.required]],
    notes: [''],
  });

  constructor(
    private fb: FormBuilder,
    private apps: ApplicationsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.statuses = this.apps.statuses();

    this.id = this.route.snapshot.paramMap.get('id');
    const isEdit = this.router.url.includes('/edit');

    if (this.id && isEdit) {
      const item = this.apps.getById(this.id);
      if (!item) {
        this.router.navigateByUrl('/applications');
        return;
      }
      this.form.patchValue({
        company: item.company,
        role: item.role,
        location: item.location,
        status: item.status,
        appliedDate: item.appliedDate,
        notes: item.notes,
      });
    }
  }

  get isEdit(): boolean {
    return !!this.id && this.router.url.includes('/edit');
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (this.isEdit && this.id) {
      this.apps.update(this.id, value);
      this.router.navigate(['/applications', this.id]);
      return;
    }

    const created = this.apps.create(value);
    this.router.navigate(['/applications', created.id]);
  }
}
