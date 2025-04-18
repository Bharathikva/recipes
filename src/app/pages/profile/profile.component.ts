import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { trigger, transition, query, style, stagger, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', style({opacity: 0}), {optional: true}),
        query(':enter', stagger('30ms', [
          animate('1s ease-in', keyframes([
            style({opacity: 0, transform: 'translateY(-75px)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)', offset: 0.3}),
            style({opacity: 1, transform: 'translateY(0)', offset: 1}),
          ]))
        ]), {optional: true}),

        query(':leave', stagger('30ms', [
          animate('1s ease-in', keyframes([
            style({opacity: 1, transform: 'translateY(0)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)', offset: 0.3}),
            style({opacity: 0, transform: 'translateY(-75px)', offset: 1}),
          ]))
        ]), {optional: true}),

      ])
    ])
  ]
})
export class ProfileComponent implements OnInit {
  user: any;
  profileForm!: FormGroup;
  isEditing = false;
  apptDashboard: any[]=[];

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.authService.getUserById(userId).subscribe((res) => {
        this.user = res;
        this.profileForm = this.fb.group({
          name: [this.user.name, Validators.required],
          email: [this.user.email, [Validators.required, Validators.email]],
          profile: [this.user.profile],
        });
      });
    }
  }

  enableEdit() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.profileForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      profile: this.user.profile,
    });
  }

  updateProfile() {
    const { name, email, profile } = this.profileForm.value;
    this.authService
      .updateUserById(this.user.id, name, email, profile)
      .subscribe(() => {
        this.user = { ...this.user, name, email, profile };
        this.isEditing = false;
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your changes have been saved successfully.',
          confirmButtonColor: '#5c2a4a',
        });
      })
  }
}
