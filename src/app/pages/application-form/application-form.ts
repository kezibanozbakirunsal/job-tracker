import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ApplicationsService } from '../../services/applications.service';
import { ApplicationStatus } from '../../models/application.model';

type FormShape = {
  company: FormControl<string>;
  role: FormControl<string>;
  location: FormControl<string>;
  status: FormControl<ApplicationStatus>;
  appliedDate: FormControl<string>;
  notes: FormControl<string>;
};

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './application-form.html',
  styleUrl: './application-form.css',
})
export class ApplicationForm implements OnInit {
  statuses: ApplicationStatus[] = [];
  isEdit = false;
  private editingId: string | null = null;

  form = new FormGroup<FormShape>({
    company: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    role: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    location: new FormControl('', { nonNullable: true }),
    status: new FormControl('Applied' as ApplicationStatus, { nonNullable: true, validators: [Validators.required] }),
    appliedDate: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true }),
  });

  constructor(
    private apps: ApplicationsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.statuses = this.apps.statuses();

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isEdit = true;
    this.editingId = id;

    const item = this.apps.getById(id);
    if (!item) return;

    this.form.patchValue({
      company: item.company,
      role: item.role,
      location: item.location,
      status: item.status,
      appliedDate: (item.appliedDate as any) ?? '',
      notes: (item.notes as any) ?? '',
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    // 👇 IMPORTANT: always send strings (no null/undefined) to satisfy your NewApplication type
    const payload = {
      company: v.company,
      role: v.role,
      location: v.location,
      status: v.status,
      appliedDate: v.appliedDate || '',
      notes: v.notes || '',
    };

    if (this.isEdit && this.editingId) {
      this.apps.update(this.editingId, payload);
    } else {
      this.apps.create(payload);
    }

    this.router.navigateByUrl('/applications');
  }
}
