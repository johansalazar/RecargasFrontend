import { Component, OnInit } from '@angular/core';
import { Recarga } from '../../Interfaces/recarga.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RecargaService } from '../../services/recarga.service';
import { CommonModule, DATE_PIPE_DEFAULT_TIMEZONE } from '@angular/common';
import { Operador } from '../../Interfaces/operador.interface';
import { Vendedor } from '../../Interfaces/vendedor.interface';
import { OperadorService } from '../../services/operador.service';
import { VendedorService } from '../../services/vendedor.service';

@Component({
  selector: 'app-recarga',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recarga.component.html',
  styleUrl: './recarga.component.css',
})
export class RecargaComponent implements OnInit {
  operadores: Operador[] = [];
  vendedores: Vendedor[] = [];
  recargas: Recarga[] = []; // Lista de Recargaes cargados
  recargaForm!: FormGroup; // Formulario reactivo para manejar los datos de RECARGAS
  selectedRecarga: Recarga | null = null; // Usuario seleccionado para editar/ver
  showModal = false; // Control del estado del modal
  submitted = false; // Control para activar validaciones
  modalTitle: string = ''; // Variable para el título del modal
  viewOk = false;
  showDeleteConfirmation = false; // Control de la vista de confirmación
  operadorNombresCache: { [id: number]: string } = {};
  lastId: number = 0;

  constructor(
    private fb: FormBuilder,
    private recargaService: RecargaService,
    private operadorService: OperadorService,
    private vendedorService: VendedorService
  ) {}
  ngOnInit(): void {
    this.loadOperadores(); // Cargar Operadores al inicializar
    this.loadVendedores(); // Cargar Vendedores al inicializar
    this.loadRecargaes(); // Cargar Recargaes al inicializar
    this.initializeForm(); // Inicializar el formulario reactivo
  }

  // Inicializa el formulario reactivo
  initializeForm(): void {
    this.recargaForm = this.fb.group({
      id: [''],
      valor: ['', [Validators.required, Validators.minLength(3)]],
      //fecha: ['', [Validators.required]],
      operadorId: ['', [Validators.required]], // Campo ID del operador requerido
      vendedorId: ['', [Validators.required]], // Campo ID del vendedor requerido
    });
  }

  // Carga la lista de Operadores desde el servicio
  loadOperadores(): void {
    this.operadorService.getOperadores().subscribe({
      next: (respose: Operador[]) => {
        this.operadores = respose;
      },
      error: (err) => console.error('Error al cargar Operadores', err),
    });
  }

  // Carga la lista de Vendedores desde el servicio
  loadVendedores(): void {
    this.vendedorService.getVendedores().subscribe({
      next: (respose: Vendedor[]) => {
        this.vendedores = respose;
      },
      error: (err) => console.error('Error al cargar Vendedores', err),
    });
  }
  // Carga la lista de Recargaes desde el servicio
  loadRecargaes(): void {
    this.recargaService.getRecarga().subscribe({
      next: (respose: Recarga[]) => {
        this.recargas = respose;
      },
      error: (err) => console.error('Error al cargar Recargaes', err),
    });
  }

  getOperadorNombre(id: number): string {
    const operador = this.operadores.find((v) => v.id === id);
    return operador ? operador.nombre : 'Desconocido';
  }

  getVendedorNombre(id: number): string {
    const vendedor = this.vendedores.find((v) => v.id === id);
    return vendedor ? vendedor.nombre : 'Desconocido';
  }

  // Abre el modal para agregar un nuevo RECARGAS
  openAddModal(): void {
    this.selectedRecarga = null; // Asegurarse de limpiar el RECARGAS seleccionado
    this.recargaForm.reset({ estado: false }); // Resetear el formulario con estado inactivo
    this.modalTitle = `Crear RECARGAS`; // Cambiar el título dinámicamente
    this.viewOk = false;
    this.showModal = true;
  }

  // Abre el modal para editar un RECARGAS existente
  openEditModal(recarga: Recarga): void {
    this.selectedRecarga = recarga;
    this.recargaForm.patchValue(recarga); // Llenar el formulario con los datos del RECARGAS
    this.modalTitle = `Editar RECARGAS`; // Cambiar el título dinámicamente
    this.viewOk = false;
    this.showModal = true;
  }

  // Guarda el RECARGAS (nuevo o editado)
  saveRecarga(): void {
    this.submitted = true;

    if (this.recargaForm.invalid) {
      return; // Si el formulario es inválido, detener la ejecución
    }

    // Obtener los datos del formulario y asignar la fecha actual
    const recargaData: Recarga = {
      ...this.recargaForm.value,
      fecha: new Date().toISOString().substring(0, 19).replace(' ', 'T'), // Formato "YYYY-MM-DD HH:mm:ss"
    };

    // Si no hay RECARGAS seleccionado, es un nuevo registro
    this.recargaService.createRecarga(recargaData).subscribe({
      next: () => {
        this.loadRecargaes(); // Recargar la lista de Recargaes
        this.closeModal();
      },
      error: (err) => console.error('Error al crear RECARGAS', err),
    });
  }

  // Elimina un RECARGAS
  openDeleteConfirmationModal(recarga: Recarga): void {
    this.selectedRecarga = recarga;
    this.showDeleteConfirmation = true; // Mostrar la confirmación de eliminación
  }

  deleteRecarga(): void {
    if (this.selectedRecarga) {
      this.recargaService.deleteRecarga(this.selectedRecarga.id).subscribe({
        next: () => {
          this.loadRecargaes(); // Recargar lista de Recargaes tras eliminar
          this.showDeleteConfirmation = false; // Cerrar el modal
        },
        error: (err) => {
          console.error('Error al eliminar RECARGAS', err);
        },
      });
    }
  }

  // Cierra el modal y resetea los valores
  closeModal(): void {
    this.showModal = false;
    this.submitted = false;
    this.recargaForm.reset();
    this.selectedRecarga = null;
  }

  // Abre un modal para visualizar detalles de un RECARGAS
  openViewModal(recarga: Recarga): void {
    this.recargaService.getRecargabyId(recarga.id).subscribe({
      next: (response: Recarga) => {
        console.log(response);
        this.selectedRecarga = response;
      },
      error: (err) => console.error('Error al cargar Recargaes', err),
    });
    this.viewOk = true;
    this.recargaForm.patchValue(recarga); // Llenar el formulario con los datos del RECARGAS
    this.modalTitle = `Detalles Usuario`;
    this.showModal = true;
  }
}
