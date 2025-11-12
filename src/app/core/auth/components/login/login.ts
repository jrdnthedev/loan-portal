import { Component } from '@angular/core';
import { Modal } from '../../../../shared/components/modal/modal';

@Component({
  selector: 'app-login',
  imports: [Modal],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {}
