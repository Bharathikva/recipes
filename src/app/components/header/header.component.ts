import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CategoriesComponent } from '../../pages/categories/categories.component';
import Swal from 'sweetalert2';
import { ModalService } from '../../services/modal.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class HeaderComponent implements AfterViewInit, OnInit {
  constructor(private authService: AuthService, private router:Router, private modalService: ModalService) {}
  user: any = null;
  showDropdown = false;

  ngAfterViewInit() {
    const menuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn?.addEventListener('click', () => {
      mobileMenu?.classList.toggle('hidden');
    });
  }

  ngOnInit() {
    this.modalService.loginModal$.subscribe(() => {
      this.openLoginModal(); // 👈 open login modal when triggered
    });
  
    const savedLang = localStorage.getItem('siteLanguage');
    if (savedLang === 'ta' || savedLang === 'en') {
      this.currentLang = savedLang;
    }
  
    if (this.authService.isLoggedIn()) {
      this.fetchUser();
    }
  
    setTimeout(() => {
      this.showLangHint = false;
    }, 5000);
  }

  
fetchUser() {
  const userId = this.authService.getUserId();
  if (userId) {
    this.authService.getUserById(userId).subscribe(
      (userData) => {
        this.user = userData;
      },
      () => {
        this.authService.clearToken();
        this.user = null;
      }
    );
  }
}
  currentLang: 'en' | 'ta' = 'en';
  showLangHint = true;

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ta' : 'en';
    localStorage.setItem('siteLanguage', this.currentLang);
  }

  // Open and close login modal
  openLoginModal() {
    document.getElementById('login-modal')?.classList.remove('hidden');
  }

  closeLoginModal() {
    document.getElementById('login-modal')?.classList.add('hidden');
  }

  // Open and close signup modal
  openSignupModal() {
    document.getElementById('signup-modal')?.classList.remove('hidden');
  }

  closeSignupModal() {
    document.getElementById('signup-modal')?.classList.add('hidden');
  }

  // Login user
  onLogin(email: string, password: string) {
    this.authService.login(email, password).subscribe(
      (response) => {
        this.authService.saveToken(response.token);
        this.authService.saveUserId(response.user.id); // save user ID
        this.closeLoginModal();
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          showConfirmButton: false,
          timer: 1500,
          confirmButtonColor: '#5c2a4a',
        });
        this.fetchUser(); // fetch and display user details
        window.location.reload()
      },
      () => {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Credentials',
          text: 'Please check your email and password.',
          confirmButtonColor: '#5c2a4a',
        });
      }
    );
  }
  

  // Signup user
  onSignup(name: string, email: string, password: string) {
    this.authService.signup(name, email, password).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Signup Successful',
          text: 'You can now log in with your credentials.',
          confirmButtonColor: '#5c2a4a',
        });
        this.closeSignupModal();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: 'Something went wrong. Please try again.',
          confirmButtonColor: '#5c2a4a',
        });
      }
    );
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  
  // Optional: close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.relative');
    if (!clickedInside) {
      this.showDropdown = false;
    }
  }
  
  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5c2a4a',
      cancelButtonColor: '#888',
      confirmButtonText: 'Yes, logout',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.clearToken();
        this.user = null;
        this.showDropdown = false;
        this.router.navigate(['/']);
  
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          showConfirmButton: false,
          timer: 1500,
          confirmButtonColor: '#5c2a4a',
        });
        window.location.reload()
      }
    });
  }
}
