import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iUser } from '../interfaces/i-user';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authSvc = inject(AuthService);
  private router = inject(Router);

  form!: FormGroup;
  user: Partial<iUser> = {};
  emailInvalid = false;
  passwordInvalid = false;
  passwordsMismatch = false;

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

  // Testare il pattern della password
  pswTest(): void {
    const testPassword = 'CiaoCiao.88$';
    const isPasswordPatternValid = this.validatePassword(testPassword);
    console.log(
      'Test Password:',
      testPassword,
      'Is Valid:',
      isPasswordPatternValid
    );
  }

  // Metodo per la validazione dell'email
  validateEmail(email: string): boolean {
    const emailPattern: RegExp =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  // Metodo per la validazione della password
  validatePassword(password: string): boolean {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    const isValidLength = password.length >= 8;

    console.log('Password:', password);
    console.log('Has Lowercase:', hasLowercase);
    console.log('Has Uppercase:', hasUppercase);
    console.log('Has Digit:', hasDigit);
    console.log('Has Special Char:', hasSpecialChar);
    console.log('Is Valid Length:', isValidLength);

    return (
      hasLowercase &&
      hasUppercase &&
      hasDigit &&
      hasSpecialChar &&
      isValidLength
    );
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
    this.emailInvalid = false;
    this.passwordInvalid = false;
    this.passwordsMismatch = false;

    if (this.form.valid) {
      const { email, password, confirmPassword } = this.form.value;
      const isEmailValid: boolean = this.validateEmail(email);
      const isPasswordValid: boolean = this.validatePassword(password);
      const passwordsMatch: boolean = password === confirmPassword;

      if (isEmailValid && isPasswordValid && passwordsMatch) {
        this.register();
      } else {
        if (!isEmailValid) {
          this.emailInvalid = true;
        }
        if (!isPasswordValid) {
          this.passwordInvalid = true;
          console.log('Password validation failed:', password);
        }
        if (!passwordsMatch) {
          this.passwordsMismatch = true;
          console.log('Passwords do not match:', password, confirmPassword);
        }
        console.log('Form validation errors');
        this.pswTest();
      }
    } else {
      console.log('Form is invalid');
      for (const controlName in this.form.controls) {
        if (this.form.controls.hasOwnProperty(controlName)) {
          const control = this.form.controls[controlName];
          console.log(`${controlName}: ${control.status}`);
          if (control.errors) {
            console.log(`${controlName} errors:`, control.errors);
          }
        }
      }
    }
  }
}
