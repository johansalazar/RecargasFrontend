import { Component, OnInit, NgModule } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../Services/user.service';
import { User } from '../interfaces/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class UsersComponent implements OnInit {

  users: User[] = []; // Lista de usuarios cargados
  userForm!: FormGroup; // Formulario reactivo para manejar los datos de usuario
  selectedUser: User | null = null; // Usuario seleccionado para editar/ver
  showModal = false; // Control del estado del modal
  submitted = false; // Control para activar validaciones
  modalTitle: string = ''; // Variable para el título del modal
  viewOk = false;
  showDeleteConfirmation = false; // Control de la vista de confirmación

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers(); // Cargar usuarios al inicializar
    this.initializeForm(); // Inicializar el formulario reactivo
  }

  // Inicializa el formulario reactivo
  initializeForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      estado: [false], // Estado como checkbox
    });
  }

  // Carga la lista de usuarios desde el servicio
  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
      },
      error: (err) => console.error('Error al cargar usuarios', err),
    });
  }

  // Abre el modal para agregar un nuevo usuario
  openAddModal(): void {
    this.selectedUser = null; // Asegurarse de limpiar el usuario seleccionado
    this.userForm.reset({ estado: false }); // Resetear el formulario con estado inactivo
    this.modalTitle = `Crear Usuario`; // Cambiar el título dinámicamente
    this.viewOk = false;
    this.showModal = true;
  }

  // Abre el modal para editar un usuario existente
  openEditModal(user: User): void {
    this.selectedUser = user;
    this.userForm.patchValue(user); // Llenar el formulario con los datos del usuario
    this.modalTitle = `Editar Usuario`; // Cambiar el título dinámicamente
    this.viewOk = false;
    this.showModal = true;
  }

  // Guarda el usuario (nuevo o editado)
  saveUser(): void {
    this.submitted = true;

    if (this.userForm.invalid) {
      return; // Si el formulario es inválido, detener la ejecución
    }

    const userData: User = { ...this.userForm.value };

    if (this.selectedUser) {
      // Si hay un usuario seleccionado, es una edición

      this.userService.updateUser(this.selectedUser.id, userData).subscribe({
        next: () => {
          this.loadUsers(); // Recargar la lista de usuarios
          this.closeModal();
        },
        error: (err) => console.error('Error al actualizar usuario', err),
      });
    } else {
      // Si no hay usuario seleccionado, es un nuevo registro
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.loadUsers(); // Recargar la lista de usuarios
          this.closeModal();
        },
        error: (err) => console.error('Error al crear usuario', err),
      });
    }
  }

  // Elimina un usuario
  openDeleteConfirmationModal(user: User): void {
    this.selectedUser = user;
    this.showDeleteConfirmation = true; // Mostrar la confirmación de eliminación
  }

  deleteUser(): void {
    if (this.selectedUser) {
      this.userService.deleteUser(this.selectedUser.id).subscribe({
        next: () => {
          this.loadUsers(); // Recargar lista de usuarios tras eliminar
          this.showDeleteConfirmation = false; // Cerrar el modal
        },
        error: (err) => {
          console.error('Error al eliminar usuario', err);
        },
      });
    }
  }

  // Cierra el modal y resetea los valores
  closeModal(): void {
    this.showModal = false;
    this.submitted = false;
    this.userForm.reset();
    this.selectedUser = null;
  }

  // Abre un modal para visualizar detalles de un usuario
  openViewModal(user: User): void {
    this.userService.getUserbyId(user.id).subscribe({
      next: (data: User) => {
        console.log(data);
        this.selectedUser = data;
      },
      error: (err) => console.error('Error al cargar usuarios', err),
    });
    this.viewOk = true;
    this.userForm.patchValue(user); // Llenar el formulario con los datos del usuario
    this.modalTitle = `Detalles Usuario`;
    this.showModal = true;
  }
}
