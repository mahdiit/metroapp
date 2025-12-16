
import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetroService, Station, MetroLine } from './services/metro.service';
import { NgSelectModule } from '@ng-select/ng-select'; // Note: In a real applet we might not have external libs, so I will build a custom dropdown to be safe and dependency-free.

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  private metroService = inject(MetroService);

  // Data Signals
  stations = signal<Station[]>([]);
  lines = signal<MetroLine[]>([]);
  
  // User Selection Signals
  sourceId = signal<string>('');
  destinationId = signal<string>('');
  
  // Computed path
  calculatedPath = signal<{ path: Station[], totalWeight: number } | null>(null);
  
  // Helper for UI state
  showSourceDropdown = signal(false);
  showDestDropdown = signal(false);
  sourceSearch = signal('');
  destSearch = signal('');

  constructor() {
    this.stations.set(this.metroService.getStations());
    this.lines.set(this.metroService.getLines());
  }

  // Filtered lists for custom dropdowns
  filteredSourceStations = computed(() => {
    const term = this.sourceSearch().toLowerCase();
    return this.stations().filter(s => s.name.toLowerCase().includes(term));
  });

  filteredDestStations = computed(() => {
    const term = this.destSearch().toLowerCase();
    return this.stations().filter(s => s.name.toLowerCase().includes(term));
  });

  selectSource(station: Station) {
    this.sourceId.set(station.id);
    this.sourceSearch.set(station.name);
    this.showSourceDropdown.set(false);
    this.calculateRoute();
  }

  selectDest(station: Station) {
    this.destinationId.set(station.id);
    this.destSearch.set(station.name);
    this.showDestDropdown.set(false);
    this.calculateRoute();
  }

  calculateRoute() {
    const start = this.sourceId();
    const end = this.destinationId();
    
    if (start && end && start !== end) {
      const result = this.metroService.findPath(start, end);
      this.calculatedPath.set(result);
    } else {
      this.calculatedPath.set(null);
    }
  }

  getLineColor(lineId: number): string {
    const line = this.lines().find(l => l.id === lineId);
    return line ? line.colorClass : 'bg-gray-400';
  }

  getLineName(lineId: number): string {
    const line = this.lines().find(l => l.id === lineId);
    return line ? line.name : '';
  }

  // Helpers for click outside closing
  toggleSource() { this.showSourceDropdown.update(v => !v); this.showDestDropdown.set(false); }
  toggleDest() { this.showDestDropdown.update(v => !v); this.showSourceDropdown.set(false); }
  
  reset() {
    this.sourceId.set('');
    this.destinationId.set('');
    this.sourceSearch.set('');
    this.destSearch.set('');
    this.calculatedPath.set(null);
  }

  // Get shared lines between two stations if they are consecutive in the path
  getConnectingLine(s1: Station, s2: Station): number | null {
    // Find a common line
    const common = s1.lines.filter(l => s2.lines.includes(l));
    return common.length > 0 ? common[0] : null;
  }
}
