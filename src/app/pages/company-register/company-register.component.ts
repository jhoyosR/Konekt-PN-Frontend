import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CompanyRegisterService } from '../../services/company-register.service';
import { CompanyRegisterRequest } from '../../interfaces/company-register-request';
import { CommonModule } from '@angular/common';

import { CommonService } from '../../services/common.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-company-register',
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './company-register.component.html',
  styleUrl: './company-register.component.css',
})
export class CompanyRegisterComponent implements OnInit {
  showPassword = false;

  registerForm: FormGroup;
  industries: string[] = [];

  constructor(
    private fb: FormBuilder,
    private companyRegisterService: CompanyRegisterService,
    private commonService: CommonService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
        nit: ['', [Validators.required]],
        industry: ['', [Validators.required]],
        address: ['', [Validators.required]],
        phone: ['', [Validators.required]],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-])[A-Za-z\d@$!%*?&.#_\-]{8,}$/,
            ),
          ],
        ],

        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }
  ngOnInit(): void {
    this.loadIndustries();
  }
  //Metodo para cargar las industrias
  private loadIndustries(): void {
    this.commonService.getConstants('industry-type').subscribe({
      next: (response) => {
        this.industries = response;
      },
      error: (error) => {
        console.error('Error cargando industrias', error);
      },
    });
  }
  //Metodo para validar que la contraseña y el confirmar contrasña sean iguales
  passwordMatchValidator(form: any) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    const confirmControl = form.get('confirmPassword');

    if (!confirmControl) return null;

    if (password !== confirmPassword) {
      confirmControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    if (confirmControl.hasError('passwordMismatch')) {
      const errors = confirmControl.errors;
      if (errors) {
        delete errors['passwordMismatch'];

        if (Object.keys(errors).length === 0) {
          confirmControl.setErrors(null);
        } else {
          confirmControl.setErrors(errors);
        }
      }
    }

    return null;
  }
  //Metodo para registrar una empresa
  Companyregister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const data: CompanyRegisterRequest = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      name: this.registerForm.value.name,
      description: this.registerForm.value.description,
      nit: this.registerForm.value.nit,
      industry: this.registerForm.value.industry,
      address: this.registerForm.value.address,
      phone: this.registerForm.value.phone,
    };

    Swal.fire({
      title: 'Registrando empresa...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        popup: 'konekt-swal',
      },
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.companyRegisterService.register(data).subscribe({
      next: (response) => {
        console.log('Register success', response);

        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'La empresa fue creada correctamente.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2563eb',
          customClass: {
            popup: 'konekt-swal',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigateByUrl('/');
          }
        });
      },

      error: (error) => {
        console.error('Register error', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error?.error?.message ||
            error?.message ||
            'No se pudo registrar la empresa.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2563eb',
          customClass: {
            popup: 'konekt-swal',
          },
        });
      },
    });
  }
  //Checkbox para mostrar y ocultar las contraseñas
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  get f() {
    return this.registerForm.controls;
  }
  //Metodo para volver al login (botón)
  goToLogin(): void {
    this.router.navigate(['/']);
  }
  //Metodo para volver al panel de roles (botón)
  goToRoles(): void {
    this.router.navigate(['/roles']);
  }
}
