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
    });
  }

  isTouchedInvalid(fieldName: string) {
    const control = this.form.get(fieldName);
    return control?.touched && control?.invalid;
  }

  register() {
    this.authSvc.register(this.form.value).subscribe((data) => {
      alert('User registered successfully!');
      this.router.navigate(['/auth/login']);
      console.log(data);
    });
  }

  onSubmit() {
    console.log(this.form.value);
    console.log(this.user);
  }
}
