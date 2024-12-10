import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Vendedor } from '../../Interfaces/vendedor.interface';
import { VendedorService } from '../../services/vendedor.service';

@Component({
  selector: 'app-vendedor',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vendedor.component.html',
  styleUrl: './vendedor.component.css'
})
export class VendedorComponent implements OnInit{

  vendedores: Vendedor[] = []; // Lista de Vendedores cargados
  vendedorForm!: FormGroup; // Formulario reactivo para manejar los datos de OPERADOR
  selectedVendedor: Vendedor | null = null; // Usuario seleccionado para editar/ver
  showModal = false; // Control del estado del modal
  submitted = false; // Control para activar validaciones
  modalTitle: string = ''; // Variable para el título del modal
  viewOk = false;
  showDeleteConfirmation = false; // Control de la vista de confirmación

  constructor(private fb: FormBuilder, private vendedorService: VendedorService) {}
  ngOnInit(): void {
    this.loadVendedores(); // Cargar Vendedores al inicializar
    this.initializeForm(); // Inicializar el formulario reactivo
  }

  // Inicializa el formulario reactivo
  initializeForm(): void {
    this.vendedorForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
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

  // Abre el modal para agregar un nuevo OPERADOR
  openAddModal(): void {
    this.selectedVendedor = null; // Asegurarse de limpiar el OPERADOR seleccionado
    this.vendedorForm.reset({ estado: false }); // Resetear el formulario con estado inactivo
    this.modalTitle = `Crear OPERADOR`; // Cambiar el título dinámicamente
    this.viewOk = false;
    this.showModal = true;
  }

  // Abre el modal para editar un OPERADOR existente
  openEditModal(vendedor: Vendedor): void {
    this.selectedVendedor = vendedor;
    this.vendedorForm.patchValue(vendedor); // Llenar el formulario con los datos del OPERADOR
    this.modalTitle = `Editar OPERADOR`; // Cambiar el título dinámicamente
    this.viewOk = false;
    this.showModal = true;
  }

  // Guarda el OPERADOR (nuevo o editado)
  saveVendedor(): void {
    this.submitted = true;

    if (this.vendedorForm.invalid) {
      return; // Si el formulario es inválido, detener la ejecución
    }

    const vendedorData: Vendedor = { ...this.vendedorForm.value };

    if (this.selectedVendedor) {
      // Si hay un OPERADOR seleccionado, es una edición

      this.vendedorService.updateVendedor(vendedorData).subscribe({
        next: () => {
          this.loadVendedores(); // Recargar la lista de Vendedores
          this.closeModal();
        },
        error: (err) => console.error('Error al actualizar OPERADOR', err),
      });
    } else {
      // Si no hay OPERADOR seleccionado, es un nuevo registro
      this.vendedorService.createVendedor(vendedorData).subscribe({
        next: () => {
          this.loadVendedores(); // Recargar la lista de Vendedores
          this.closeModal();
        },
        error: (err) => console.error('Error al crear OPERADOR', err),
      });
    }
  }

  // Elimina un OPERADOR
  openDeleteConfirmationModal(vendedor: Vendedor): void {
    this.selectedVendedor = vendedor;
    this.showDeleteConfirmation = true; // Mostrar la confirmación de eliminación
  }

  deleteVendedor(): void {
    if (this.selectedVendedor) {
      this.vendedorService.deleteVendedor(this.selectedVendedor.id).subscribe({
        next: () => {
          this.loadVendedores(); // Recargar lista de Vendedores tras eliminar
          this.showDeleteConfirmation = false; // Cerrar el modal
        },
        error: (err) => {
          console.error('Error al eliminar OPERADOR', err);
        },
      });
    }
  }

  // Cierra el modal y resetea los valores
  closeModal(): void {
    this.showModal = false;
    this.submitted = false;
    this.vendedorForm.reset();
    this.selectedVendedor = null;
  }

  // Abre un modal para visualizar detalles de un OPERADOR
  openViewModal(vendedor: Vendedor): void {
    this.vendedorService.getVendedorbyId(vendedor.id).subscribe({
      next: (response: Vendedor) => {
        console.log(response);
        this.selectedVendedor = response;
      },
      error: (err) => console.error('Error al cargar Vendedores', err),
    });
    this.viewOk = true;
    this.vendedorForm.patchValue(vendedor); // Llenar el formulario con los datos del OPERADOR
    this.modalTitle = `Detalles Usuario`;
    this.showModal = true;
  }
}

