import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApplicationsService } from './services/applications.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  constructor(private apps: ApplicationsService) {}

  ngOnInit(): void {
    this.apps.seedIfEmpty();
  }
}
