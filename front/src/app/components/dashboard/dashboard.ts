import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  services: any[] = [];
  resumen: any = {};
  incidents: any[] = [];
  healthChecks: any[] = [];
  maintenance: any[] = [];
  filtroDesde: string = '';
  filtroHasta: string = '';
  filtroEstado: string = '';
  filtroCadena: string = '';
  filtroRestaurante: string = '';
  estados: string[] = [];
  cadenas: string[] = [];
  restaurantes: string[] = [];

  testVar = 'Render OK';

  healthChecksToShow: number = 5;
  healthChecksPage: number = 1;
  healthChecksPerPage: number = 5;

  showMaintenanceModal: boolean = false;
  maintenanceEdit: any = null;
  maintenanceForm: any = {
    serviceId: '',
    titulo: '',
    estado: 'Programado',
    cadena: '',
    restaurante: '',
    fechaInicio: '',
    fechaFin: '',
    descripcion: ''
  };

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('Dashboard ngOnInit ejecutado');
    this.loadData();
    this.loadFiltrosUnicos();
  }

  loadData(filtros: any = {}) {
    console.log('Cargando datos...');
    this.apiService.getServices(filtros).subscribe({
      next: (data) => {
        console.log('Servicios:', data);
        this.services = data;
        this.cdr.detectChanges();
        console.log('this.services asignado:', this.services);
      },
      error: (err) => console.error('Error cargando servicios:', err)
    });
    this.apiService.getServicesResumen().subscribe({
      next: (data) => {
        console.log('Resumen:', data);
        this.resumen = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando resumen:', err)
    });
    this.apiService.getIncidents().subscribe({
      next: (data) => {
        console.log('Incidentes:', data);
        this.incidents = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando incidentes:', err)
    });
    this.apiService.getHealthChecks().subscribe({
      next: (data) => {
        console.log('Health Checks:', data);
        this.healthChecks = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando health checks:', err)
    });
    this.apiService.getMaintenance().subscribe({
      next: (data) => {
        console.log('Mantenimientos:', data);
        this.maintenance = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando mantenimientos:', err)
    });
  }

  loadFiltrosUnicos() {
    this.apiService.getEstados().subscribe({
      next: (data) => {
        console.log('Estados recibidos:', data);
        this.estados = Array.isArray(data) ? data.filter((e: string) => !!e) : [];
      },
      error: (err) => console.error('Error cargando estados:', err)
    });
    this.apiService.getCadenas().subscribe({
      next: (data) => {
        console.log('Cadenas recibidas:', data);
        this.cadenas = Array.isArray(data) ? data.filter((e: string) => !!e) : [];
      },
      error: (err) => console.error('Error cargando cadenas:', err)
    });
    this.apiService.getRestaurantes().subscribe({
      next: (data) => {
        console.log('Restaurantes recibidos:', data);
        this.restaurantes = Array.isArray(data) ? data.filter((e: string) => !!e) : [];
      },
      error: (err) => console.error('Error cargando restaurantes:', err)
    });
  }

  filtrarPorFecha() {
    const filtros: any = {};
    if (this.filtroDesde) filtros.desde = this.filtroDesde;
    if (this.filtroHasta) filtros.hasta = this.filtroHasta;
    filtros.campoFecha = 'fechaCreacion';
    this.loadData(filtros);
  }

  aplicarFiltros() {
    const filtros: any = {};
    if (this.filtroDesde) filtros.desde = this.filtroDesde;
    if (this.filtroHasta) filtros.hasta = this.filtroHasta;
    if (this.filtroDesde || this.filtroHasta) filtros.campoFecha = 'fechaCreacion';
    if (this.filtroEstado) filtros.estado = this.filtroEstado;
    if (this.filtroCadena) filtros.cadena = this.filtroCadena;
    if (this.filtroRestaurante) filtros.restaurante = this.filtroRestaurante;
    this.loadData(filtros);
  }

  limpiarFiltros() {
    this.filtroDesde = '';
    this.filtroHasta = '';
    this.filtroEstado = '';
    this.filtroCadena = '';
    this.filtroRestaurante = '';
    this.loadData();
  }

  verMasHealthChecks() {
    this.healthChecksToShow += 5;
  }

  verMenosHealthChecks() {
    this.healthChecksToShow = 5;
  }

  getServiceNameById(id: string): string {
    const service = this.services.find(s => s._id === id);
    return service ? service.nombre : id;
  }

  get healthChecksTotalPages(): number {
    return Math.ceil(this.healthChecks.length / this.healthChecksPerPage) || 1;
  }

  get healthChecksPaginated() {
    const start = (this.healthChecksPage - 1) * this.healthChecksPerPage;
    return this.healthChecks.slice(start, start + this.healthChecksPerPage);
  }

  setHealthChecksPage(page: number) {
    this.healthChecksPage = page;
  }

  openMaintenanceModal(editObj: any = null) {
    this.maintenanceEdit = editObj;
    if (editObj) {
      this.maintenanceForm = { ...editObj };
    } else {
      this.maintenanceForm = {
        serviceId: '', titulo: '', estado: 'Programado', cadena: '', restaurante: '', fechaInicio: '', fechaFin: '', descripcion: ''
      };
    }
    this.showMaintenanceModal = true;
  }

  closeMaintenanceModal() {
    this.showMaintenanceModal = false;
    this.maintenanceEdit = null;
  }

  submitMaintenance() {
    if (!this.maintenanceForm.serviceId || !this.maintenanceForm.titulo || !this.maintenanceForm.estado || !this.maintenanceForm.fechaInicio) {
      alert('Por favor, completa los campos obligatorios: Servicio, Título, Estado y Fecha de inicio.');
      return;
    }
    if (this.maintenanceEdit) {
      this.apiService.updateMaintenance(this.maintenanceEdit._id, this.maintenanceForm).subscribe({
        next: () => { this.closeMaintenanceModal(); this.loadData(); },
        error: (err) => alert('Error actualizando mantenimiento')
      });
    } else {
      this.apiService.createMaintenance(this.maintenanceForm).subscribe({
        next: () => { this.closeMaintenanceModal(); this.loadData(); },
        error: (err) => alert('Error creando mantenimiento')
      });
    }
  }

  editMaintenance(m: any) {
    this.openMaintenanceModal(m);
  }
}
