import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FBControl } from '../../../../shared/interfaces/fbcontrol'
import { XhrService } from '../../../../shared/services/xhr/xhr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Location } from '@angular/common';



@Component({
  selector: 'app-single-group',
  templateUrl: './single-group.component.html',
  styleUrls: ['./single-group.component.scss', '../../groups.scss'],
  providers: [ConfirmationService, MessageService],
})
export class SingleGroupComponent implements OnInit {

  constructor(
    private FormBuilder: FormBuilder,
    private XhrService: XhrService,
    private ActivatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private Router:Router,
    private Location:Location
  ) { }

  groupId: any

  editGroupForm: FormGroup


  isShowEditGroupModal = false

  editGroupControls: FBControl[] = [
    {
      label: 'إسم المجموعة',
      name: 'name',
      formControlName: 'name',
      type: 'textbox',
      readonly: false,
      placeholder: 'أكتب إسم المجموعة',
      icon: '',
      class: '',
      cols: 12,
      value: [],
      isRequired: true
    },
    {
      label: 'وصف المجموعة',
      name: 'description',
      formControlName: 'description',
      type: 'textbox',
      readonly: false,
      placeholder: 'أكتب وصف المجموعة',
      icon: '',
      class: '',
      cols: 12,
      value: [],
      isRequired: false
    },
    {
      label: 'الملاحظات',
      name: 'note',
      formControlName: 'note',
      type: 'textbox',
      readonly: false,
      placeholder: 'أكتب الملاحظات',
      icon: '',
      class: '',
      cols: 12,
      value: [],
      isRequired: false
    }
  ]

  ngOnInit(): void {
    this.groupId = this.ActivatedRoute.snapshot.paramMap.get('id');
    // console.log(this.groupId)
    this.getGroupDetails()
  }

  back(){
    this.Location.back()
  }

  // edit group
  initEditGroup() {
    this.isShowEditGroupModal = true
    const fieldsCtrls: any = {};
    this.editGroupControls.forEach((field: any) => {
      fieldsCtrls[field.formControlName] = this.FormBuilder.control(null, field.isRequired ? Validators.required : null);
    });
    this.editGroupForm = this.FormBuilder.group(fieldsCtrls);
    this.editGroupForm.get('name')?.setValue(this.groupDetails.name)
    this.editGroupForm.get('description')?.setValue(this.groupDetails.description)
    this.editGroupForm.get('note')?.setValue(this.groupDetails.note)
    // console.log(this.editGroupForm)
  }

  editGroup() {
    let payload = {
      id: this.groupId,
      name: this.editGroupForm.get('name')?.value,
      description: this.editGroupForm.get('description')?.value,
      note: this.editGroupForm.get('note')?.value,
    }
    this.XhrService.put('v1/grouplevels/update', payload).subscribe(res => {
      if (res.data) {
        this.isShowEditGroupModal = false
        this.getGroupDetails()
      }
    })
  }

  confirmationDelete() {
    this.confirmationService.confirm({
      accept: () => {
        this.deleteGroup()
      },
      reject: () => {
      }
    })
  }

  deleteGroup() {
    // console.log(this.groupId)
    this.XhrService.delete('v1/grouplevels/deletesoft/' + this.groupId).subscribe(res => {
      if (res.data) {
        this.Router.navigate(['cms/groups'])
      }
    })
  }







  // get data

  groupDetails: any
  getGroupDetails() {
    this.XhrService.get(`v1/grouplevels/get-id/${this.groupId}`).subscribe(res => {
      // console.log(res)
      if (res.data) {
        this.groupDetails = res.data
      }
    })
  }



}
