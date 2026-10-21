import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FBControl } from '../../../../shared/interfaces/fbcontrol'
import { XhrService } from '../../../../shared/services/xhr/xhr.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';




@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss', '../../groups.scss']
})
export class PermissionsComponent implements OnInit {

  constructor(
    private FormBuilder: FormBuilder,
    private XhrService: XhrService,
    private ActivatedRoute: ActivatedRoute,
    private Location:Location
  ) {

  }

  groupId: any

  editPermissionsForm: FormGroup

  ngOnInit(): void {
    this.groupId = this.ActivatedRoute.snapshot.paramMap.get('id');
    this.getGroupDetails()

  }

  back(){
    this.Location.back()
  }


  updatePermissions() {
    this.XhrService.put('v1/grouplevels/update', this.update_payload).subscribe(res => {
      // console.log(res)
      if (res.data) {
        this.getGroupDetails()
        this.selectedPermissions = []
      }
    })
  }


  selectedPermissions: any[] = []
  checkboxValue(event: any) {
    this.selectedPermissions = []
    let keys = Object.keys(this.editPermissionsForm.value)
    for (let i = 0; i < keys.length; i++) {
      if (this.editPermissionsForm.get(keys[i])?.value) {
        this.selectedPermissions.push(keys[i])
      }
    }
    // console.log(this.selectedPermissions)
    this.update_payload.permissions = this.selectedPermissions
  }






  //get data

  groupDetails: any
  update_payload: any = {
    permissions: []
  }
  getGroupDetails() {
    this.XhrService.get(`v1/grouplevels/get-id/${this.groupId}`).subscribe(res => {
      this.getPermissionsList()
      // console.log(res)
      if (res.data) {
        this.groupDetails = res.data
        this.update_payload = {
          name: this.groupDetails.name,
          description: this.groupDetails.description,
          note: this.groupDetails.note,
          id: this.groupDetails.id,
          permissions: this.groupDetails.permissions
        }
        // console.log(this.update_payload)
      }
    })
  }


  permissionsList: any[] = []
  getPermissionsList() {
    this.XhrService.get('v1/grouplevels/get-all-permissions').subscribe(res => {
      if (res.data) {
        this.permissionsList = res.data
        this.transformToDynamic()
      }
    })
  }


  allControls: any[] = []
  transformToDynamic() {
    this.allControls = []
    for (let i = 0; i < this.permissionsList.length; i++) {
      for (let x = 0; x < this.permissionsList[i].permissions.length; x++) {
        let object = this.permissionsList[i].permissions[x]
        this.permissionsList[i].permissions[x].value = false
        this.permissionsList[i].permissions[x].type = 'checkbox'
        this.permissionsList[i].permissions[x].label = object.name
        this.permissionsList[i].permissions[x].name = object.id
        this.permissionsList[i].permissions[x].formControlName = object.id
        this.allControls.push(this.permissionsList[i].permissions[x])
      }
    }

    let keys = this.groupDetails.permissions
    if (keys.length > 0) {
      for (let i = 0; i < keys.length; i++) {
        let permission = this.allControls.find(control => control.name == keys[i])
        permission ? permission.value = true : false
      }
      // this.editPermissionsForm.updateValueAndValidity()
    }

    // console.log(this.allControls)
    const fieldsCtrls: any = {};
    this.allControls.forEach((field: any) => {
      fieldsCtrls[field.formControlName] = this.FormBuilder.control(null, field.isRequired ? Validators.required : null);
    });
    this.editPermissionsForm = this.FormBuilder.group(fieldsCtrls);
    this.editPermissionsForm.updateValueAndValidity()





  }




}
