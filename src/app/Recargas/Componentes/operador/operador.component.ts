import { Component, OnInit } from '@angular/core';
import { Operador } from '../../Interfaces/operador.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OperadorService } from '../../services/operador.service';
import { genericResponse } from '../../../Auth/Interfaces/genericResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-operador',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './operador.component.html',
  styleUrl: './operador.component.css'
})
export class OperadorComponent implements OnInit{

  operadores: Operador[] = []; // Lista de Operadores cargados
  operadorForm!: FormGroup; // Formulario reactivo para manejar los datos de OPERADOR
  selectedOperador: Operador | null = null; // Usuario seleccionado para editar/ver
  showModal = false; // Control del estado del modal
  submitted = false; // Control para activar validaciones
  modalTitle: string = ''; // Variable para el título del modal
  viewOk = false;
  showDeleteConfirmation = false; // Control de la vista de confirmación

  constructor(private fb: FormBuilder, private operadorService: OperadorService) {}
  ngOnInit(): void {
    this.loadOperadores(); // Cargar Operadores al inicializar
    this.initializeForm(); // Inicializar el formulario reactivo
  }

  // Inicializa el formulario reactivo
  initializeForm(): void {
    this.operadorForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
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

  // Abre el modal para agregar un nuevo OPERADOR
  openAddModal(): void {
    this.selectedOperador = null; // Asegurarse de limpiar el OPERADOR seleccionado
    this.operadorForm.reset({ estado: false }); // Resetear el formulario con estado inactivo
    this.modalTitle = `Crear OPERADOR`; // Cambiar el título dinámicamente
    this.viewOk = false;
    this.showModal = true;
  }

  // Abre el modal para editar un OPERADOR existente
  openEditModal(operador: Operador): void {
    this.selectedOperador = operador;
    this.operadorForm.patchValue(operador); // Llenar el formulario con los datos del OPERADOR
    this.modalTitle = `Editar OPERADOR`; // Cambiar el título dinámicamente
    this.viewOk = false;
    this.showModal = true;
  }

  // Guarda el OPERADOR (nuevo o editado)
  saveOperador(): void {
    this.submitted = true;

    if (this.operadorForm.invalid) {
      return; // Si el formulario es inválido, detener la ejecución
    }

    const operadorData: Operador = { ...this.operadorForm.value };

    if (this.selectedOperador) {
      // Si hay un OPERADOR seleccionado, es una edición

      this.operadorService.updateOperador(operadorData).subscribe({
        next: () => {
          this.loadOperadores(); // Recargar la lista de Operadores
          this.closeModal();
        },
        error: (err) => console.error('Error al actualizar OPERADOR', err),
      });
    } else {
      // Si no hay OPERADOR seleccionado, es un nuevo registro
      this.operadorService.createOperador(operadorData).subscribe({
        next: () => {
          this.loadOperadores(); // Recargar la lista de Operadores
          this.closeModal();
        },
        error: (err) => console.error('Error al crear OPERADOR', err),
      });
    }
  }

  // Elimina un OPERADOR
  openDeleteConfirmationModal(operador: Operador): void {
    this.selectedOperador = operador;
    this.showDeleteConfirmation = true; // Mostrar la confirmación de eliminación
  }

  deleteOperador(): void {
    if (this.selectedOperador) {
      this.operadorService.deleteOperador(this.selectedOperador.id).subscribe({
        next: () => {
          this.loadOperadores(); // Recargar lista de Operadores tras eliminar
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
    this.operadorForm.reset();
    this.selectedOperador = null;
  }

  // Abre un modal para visualizar detalles de un OPERADOR
  openViewModal(operador: Operador): void {
    this.operadorService.getOperadorbyId(operador.id).subscribe({
      next: (response: Operador) => {
        console.log(response);
        this.selectedOperador = response;
      },
      error: (err) => console.error('Error al cargar Operadores', err),
    });
    this.viewOk = true;
    this.operadorForm.patchValue(operador); // Llenar el formulario con los datos del OPERADOR
    this.modalTitle = `Detalles Usuario`;
    this.showModal = true;
  }
}
