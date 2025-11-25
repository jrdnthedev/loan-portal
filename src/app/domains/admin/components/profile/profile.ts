import { Component, Input } from '@angular/core';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  @Input() user!: User;
}
