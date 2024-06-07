import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iUser } from '../interfaces/i-user';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authSvc = inject(AuthService);
  private router = inject(Router);

  form!: FormGroup;
  user: Partial<iUser> = {};

  ngOnInit() {
    this.form = this.fb.group({
      name: this.fb.control(null, [Validators.required]),
      surname: this.fb.control(null, [Validators.required]),
      gender: this.fb.control(null, [Validators.required]),
      dateBirth: this.fb.control(null, [Validators.required]),
      biography: this.fb.control(null, [Validators.required]),
      userImage: this.fb.control(null, [Validators.required]),
      username: this.fb.control(null, [Validators.required]),
      email: this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required]),
      confirmPassword: this.fb.control(null, [Validators.required]),
    });
  }

  // Metodo per la validazione dell'email
  validateEmail(email: string): boolean {
    const emailPattern: RegExp =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  // Metodo per la validazione della password
  validatePassword(password: string): boolean {
    const passwordPattern: RegExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  }

  isTouchedInvalid(fieldName: string): boolean | undefined {
    const control = this.form.get(fieldName);
    return control?.touched && control?.invalid;
  }

  register(): void {
    this.authSvc.register(this.form.value).subscribe((data) => {
      alert('User registered successfully!');
      this.router.navigate(['/auth/login']);
      console.log(data);
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { email, password, confirmPassword } = this.form.value;
      const isEmailValid: boolean = this.validateEmail(email);
      const isPasswordValid: boolean = this.validatePassword(password);
      const passwordsMatch: boolean = password === confirmPassword;

      if (isEmailValid && isPasswordValid && passwordsMatch) {
        this.register();
      } else {
        let errorMessage = '';
        if (!isEmailValid) {
          errorMessage += "L'email inserita non è valida. ";
        }
        if (!isPasswordValid) {
          errorMessage +=
            'La password deve contenere almeno una lettera maiuscola, una minuscola, un numero e un carattere speciale, e deve essere lunga almeno 8 caratteri. ';
        }
        if (!passwordsMatch) {
          errorMessage +=
            'Le password non corrispondono. Per favore, inserisci la stessa password in entrambi i campi.';
        }
        console.log(errorMessage);
      }
    }
  }
}
