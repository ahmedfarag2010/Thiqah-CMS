import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';



@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss',
  standalone: true,
  imports: [ToastModule],
  providers: []
})
export class ToasterComponent {
  constructor(private messageService: MessageService) {

  }
}
