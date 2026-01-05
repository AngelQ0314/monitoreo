import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000'; // URL del backend

  constructor(private http: HttpClient) {}

  // Servicios
  getServices(filters?: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/services`, { params: filters });
  }

  getServicesResumen(): Observable<any> {
    return this.http.get(`${this.baseUrl}/services/resumen`);
  }

  createService(service: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/services`, service);
  }

  // Incidentes
  getIncidents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/incidents`);
  }

  createIncident(incident: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/incidents`, incident);
  }

  updateIncidentStatus(id: string, status: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/incidents/${id}/status`, status);
  }

  // Mantenimiento
  getMaintenance(): Observable<any> {
    return this.http.get(`${this.baseUrl}/maintenance`);
  }

  createMaintenance(maintenance: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/maintenance`, maintenance);
  }

  // Health-checks
  getHealthChecks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health-checks`);
  }

  // Filtros únicos para selectores
  getEstados(): Observable<any> {
    return this.http.get(`${this.baseUrl}/services/estados`);
  }

  getCadenas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/services/cadenas`);
  }

  getRestaurantes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/services/restaurantes`);
  }
}