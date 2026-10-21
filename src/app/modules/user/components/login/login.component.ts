import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { XhrService } from '../../../../shared/services/xhr/xhr.service';
import { SharedService } from '../../../../shared/services/shared/shared.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup

  constructor(
    private FormBuilder: FormBuilder,
    private AuthService:AuthService,
    private Router:Router,
    private XhrService:XhrService,
    private SharedService:SharedService
  ){

  }

  loginControls = [
    {
      label: 'البريد الإلكتروني',
      name: 'username',
      formControlName: 'username',
      type: 'textbox',
      contentType:'',
      readonly: false,
      placeholder: 'أكتب البريد الإلكتروني',
      icon: '',
      class: '',
      cols:12,
      value:[]
    },
    {
      label: 'كلمة المرور',
      name: 'password',
      formControlName: 'password',
      type: 'textbox',
      contentType:'password',
      readonly: false,
      placeholder: 'أكتب كلمة المرور',
      icon: '',
      class: '',
      cols:12,
      value:[]
    }
  ]

  ngOnInit(): void {
    this.AuthService.isUserLogged() ? this.Router.navigate(['cms']) : this.initForm()
      
  }

  initForm() {
    const fieldsCtrls:any = {};
    this.loginControls.forEach((field:any) => {
      fieldsCtrls[field.formControlName] = this.FormBuilder.control(null, Validators.required);
    });
    this.loginForm = this.FormBuilder.group(fieldsCtrls);
  }

  login(loginForm:any){
    loginForm.password = this.SharedService.encrypt(loginForm.password)
    this.XhrService.post('v1/accounts/login',loginForm).subscribe(res => {
      if(res.data){
        this.AuthService.setToken(res.data.token)
        this.Router.navigate(['cms'])
      }
    })
  }

}
