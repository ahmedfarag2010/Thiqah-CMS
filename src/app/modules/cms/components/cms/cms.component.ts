import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrl: './cms.component.scss',
  host: {'class': 'cmsComponent'}
})
export class CmsComponent implements OnInit {

  constructor(private http:HttpClient){

  }
  ngOnInit(): void {
    this.collapseMenu()
  }

  collapseMenu(){
    let burger = document.querySelector('.header__burger')
    if(burger){
      burger.addEventListener('click',() => {
        burger?.classList.toggle('active')
        document.querySelector('aside')?.classList.toggle('active')
      })
    }
  }

}
