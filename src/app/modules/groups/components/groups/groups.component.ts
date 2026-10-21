import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FBControl } from '../../../../shared/interfaces/fbcontrol'
import { XhrService } from '../../../../shared/services/xhr/xhr.service';
import { SharedService } from '../../../../shared/services/shared/shared.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { PermissionsService } from '../../../../shared/services/permissions.service';




@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
  providers: [ConfirmationService, MessageService],

})
export class GroupsComponent implements OnInit {

  select_group_permission = 'read_groups'
  groupForm: FormGroup


  isShowGroupModal = false
  isShowConfirmationDeleteModal = false

  constructor(
    private FormBuilder: FormBuilder,
    private XhrService: XhrService,
    private SharedService: SharedService,
    private confirmationService: ConfirmationService,
    private Router: Router,
    private PermissionsService: PermissionsService
  ) { }

  currentAction = 'add'

  modal_title = 'إنشاء مجموعة جديدة'
  modal_button = 'إنشاء مجموعة'

  groupControls: FBControl[] = [
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
      label: 'مجموعة فرعية',
      name: 'subGroup',
      formControlName: 'subGroup',
      type: 'checkbox',
      readonly: false,
      icon: '',
      class: '',
      cols: 4,
      value: [],
      isRequired: false
    },
    {
      label: 'المجموعة الأساسية',
      name: 'parentId',
      formControlName: 'parentId',
      type: 'dropdown',
      readonly: true,
      placeholder: 'المجموعة الأساسية',
      icon: '',
      class: '',
      cols: 4,
      value: [],
      isRequired: false,
      options: [],
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

  data_table: any = {}


  ngOnInit() {
    if (this.PermissionsService.isHasPermissions(this.select_group_permission)) {
      this.getParentGroups()
      
      this.data_table = {
        cols: [
          {
            label: 'الرقم',
            key: 'number'
          },
          {
            label: 'إسم المجموعة',
            key: 'groupName'
          },
          {
            label: 'المجموعة الرئيسية',
            key: 'parent'
          },
          {
            label: 'عدد الأعضاء',
            key: 'members'
          },
          {
            label: 'تاريخ الإنشاء',
            key: 'creationDate'
          },
          {
            label: 'الإجراء',
            key: 'actions'
          }
        ],
        data: [
        ]
      }
      // this.appendData()
    } else {
      this.Router.navigate(['cms/home'])
      this.SharedService.showToaster('error', 'خطأ', 'ليس لديك صلاحية للوصول لهذه الصفحة', 5000)
    }

  }

  appendCustomElements() {
    for (let i = 0; i < this.data_table.data.length; i++) {
      this.data_table.data[i].actions = `
        <div class="data-table__actions">
          <div data-index=${i} has-event='true' data-event='click' data-action='editGroup'>
            <span class="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M21.4549 5.41575C21.6471 5.70687 21.615 6.10248 21.3588 6.35876L12.1664 15.5511C12.0721 15.6454 11.9545 15.7128 11.8256 15.7465L7.99716 16.7465C7.87229 16.7791 7.74358 16.7784 7.62265 16.7476C7.49408 16.7149 7.37431 16.6482 7.27729 16.5511C7.08902 16.3629 7.01468 16.0889 7.08197 15.8313L8.08197 12.0028C8.11144 11.89 8.16673 11.7786 8.24322 11.6912L17.4697 2.46967C17.5504 2.38891 17.6477 2.32846 17.7536 2.29163C17.8321 2.26432 17.9153 2.25 18 2.25C18.1989 2.25 18.3897 2.32902 18.5303 2.46967L21.3588 5.2981C21.3954 5.33471 21.4274 5.37416 21.4549 5.41575ZM19.7678 5.82843L18 4.06066L9.48184 12.5788L8.85685 14.9716L11.2496 14.3466L19.7678 5.82843Z" fill="#36B4E5"/>
                <path d="M19.6414 17.1603C19.9148 14.8227 20.0018 12.4688 19.9023 10.1208C19.8976 10.0084 19.9399 9.89898 20.0194 9.81942L21.0027 8.83609C21.1236 8.71519 21.3302 8.79194 21.3415 8.96254C21.5265 11.7522 21.4564 14.5545 21.1312 17.3346C20.8946 19.3571 19.2703 20.9421 17.2583 21.167C13.7917 21.5544 10.2083 21.5544 6.74177 21.167C4.72971 20.9421 3.10538 19.3571 2.86883 17.3346C2.45429 13.7903 2.45429 10.2097 2.86883 6.66543C3.10538 4.6429 4.72971 3.05789 6.74177 2.83301C9.37152 2.5391 12.0685 2.46815 14.7306 2.62016C14.9022 2.62996 14.9804 2.83757 14.8589 2.95909L13.8664 3.95165C13.7877 4.03034 13.6798 4.07261 13.5685 4.06885C11.3421 3.99376 9.10055 4.07872 6.90838 4.32373C5.57827 4.47239 4.51278 5.522 4.35867 6.83968C3.95767 10.2682 3.95767 13.7318 4.35867 17.1603C4.51278 18.478 5.57827 19.5276 6.90838 19.6763C10.2642 20.0513 13.7358 20.0513 17.0916 19.6763C18.4218 19.5276 19.4872 18.478 19.6414 17.1603Z" fill="#36B4E5"/>
              </svg>
            </span>
            <p class="tooltip">تعديل المجموعة</p>
          </div>
          <div data-index=${i} has-event='true' data-event='click' data-action='editPermissions'>
            <span class="icon">
              <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.2498 3C4.00727 3 3 4.00727 3 5.2498V18.7486C3 19.9911 4.00727 20.9984 5.2498 20.9984H11.1644L11.5202 19.5754C11.5266 19.5497 11.5333 19.5241 11.5402 19.4985H5.2498C4.83563 19.4985 4.49987 19.1628 4.49987 18.7486V5.2498C4.49987 4.83563 4.83563 4.49987 5.2498 4.49987H18.7486C19.1628 4.49987 19.4985 4.83563 19.4985 5.2498V11.2317C19.9774 11.0412 20.492 10.9678 20.9984 11.0115V5.2498C20.9984 4.00727 19.9911 3 18.7486 3H5.2498ZM15.3539 14.9989H11.2493C10.835 14.9989 10.4993 15.3347 10.4993 15.7489C10.4993 16.163 10.835 16.4988 11.2493 16.4988H13.8541L15.3539 14.9989ZM8.74949 8.24954C8.74949 8.80177 8.30181 9.24945 7.74958 9.24945C7.19735 9.24945 6.74967 8.80177 6.74967 8.24954C6.74967 7.69731 7.19735 7.24963 7.74958 7.24963C8.30181 7.24963 8.74949 7.69731 8.74949 8.24954ZM11.2493 7.4996C10.8351 7.4996 10.4993 7.83536 10.4993 8.24954C10.4993 8.66371 10.8351 8.99947 11.2493 8.99947H16.7488C17.163 8.99947 17.4987 8.66371 17.4987 8.24954C17.4987 7.83536 17.163 7.4996 16.7488 7.4996H11.2493ZM11.2493 11.2493C10.835 11.2493 10.4993 11.585 10.4993 11.9992C10.4993 12.4134 10.835 12.7491 11.2493 12.7491H16.7486C17.1629 12.7491 17.4985 12.4134 17.4985 11.9992C17.4985 11.585 17.1629 11.2493 16.7486 11.2493H11.2493ZM7.74958 12.9991C8.30181 12.9991 8.74949 12.5515 8.74949 11.9992C8.74949 11.447 8.30181 10.9993 7.74958 10.9993C7.19735 10.9993 6.74967 11.447 6.74967 11.9992C6.74967 12.5515 7.19735 12.9991 7.74958 12.9991ZM8.74949 15.7489C8.74949 16.3011 8.30181 16.7488 7.74958 16.7488C7.19735 16.7488 6.74967 16.3011 6.74967 15.7489C6.74967 15.1966 7.19735 14.749 7.74958 14.749C8.30181 14.749 8.74949 15.1966 8.74949 15.7489ZM19.0984 12.6686L13.1965 18.5705C12.8524 18.9146 12.6083 19.3458 12.4903 19.8179L12.0327 21.6484C11.8336 22.4445 12.5547 23.1656 13.3508 22.9666L15.1813 22.5089C15.6534 22.3909 16.0846 22.1468 16.4287 21.8027L22.3306 15.9008C23.2231 15.0082 23.2231 13.5611 22.3306 12.6686C21.4381 11.7761 19.991 11.7761 19.0984 12.6686Z" fill="#36b4e5"/>
              </svg>
            </span>
            <p class="tooltip">تعديل الصلاحيات</p>
          </div>
          <div data-index=${i} has-event='true' data-event='click' data-action='addUsers'>
            <span class="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.57053 3.57053C9.48008 2.66098 10.7137 2.15 12 2.15C13.2863 2.15 14.5199 2.66098 15.4295 3.57053C16.339 4.48008 16.85 5.7137 16.85 7C16.85 8.2863 16.339 9.51992 15.4295 10.4295C14.5199 11.339 13.2863 11.85 12 11.85C10.7137 11.85 9.48008 11.339 8.57053 10.4295C7.66097 9.51992 7.14999 8.2863 7.14999 7C7.14999 5.7137 7.66097 4.48008 8.57053 3.57053ZM12 3.85C11.1646 3.85 10.3633 4.18187 9.77261 4.77261C9.18187 5.36335 8.84999 6.16457 8.84999 7C8.84999 7.83543 9.18187 8.63665 9.77261 9.22739C10.3633 9.81813 11.1646 10.15 12 10.15C12.8354 10.15 13.6366 9.81813 14.2274 9.22739C14.8181 8.63665 15.15 7.83543 15.15 7C15.15 6.16457 14.8181 5.36335 14.2274 4.77261C13.6366 4.18187 12.8354 3.85 12 3.85Z" fill="#36B4E5"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.15 19C15.15 18.5306 15.5306 18.15 16 18.15H22C22.4694 18.15 22.85 18.5306 22.85 19C22.85 19.4694 22.4694 19.85 22 19.85H16C15.5306 19.85 15.15 19.4694 15.15 19Z" fill="#36B4E5"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M19 15.15C19.4694 15.15 19.85 15.5306 19.85 16V22C19.85 22.4694 19.4694 22.85 19 22.85C18.5306 22.85 18.15 22.4694 18.15 22V16C18.15 15.5306 18.5306 15.15 19 15.15Z" fill="#36B4E5"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99999 15.85C9.16456 15.85 8.36335 16.1819 7.77261 16.7726C7.18187 17.3634 6.84999 18.1646 6.84999 19V21C6.84999 21.4694 6.46944 21.85 5.99999 21.85C5.53055 21.85 5.14999 21.4694 5.14999 21V19C5.14999 17.7137 5.66097 16.4801 6.57053 15.5705C7.48008 14.661 8.71369 14.15 9.99999 14.15H14C14.4694 14.15 14.85 14.5306 14.85 15C14.85 15.4694 14.4694 15.85 14 15.85H9.99999Z" fill="#36B4E5"/>
              </svg>
            </span>
            <p class="tooltip">تعديل الأعضاء</p>
          </div>
          <div data-index=${i} has-event='true' data-event='click' data-action='deleteGroup'>
             <span class="icon">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2.25C9.58579 2.25 9.25 2.58579 9.25 3V3.75H5C4.58579 3.75 4.25 4.08579 4.25 4.5C4.25 4.91421 4.58579 5.25 5 5.25H19C19.4142 5.25 19.75 4.91421 19.75 4.5C19.75 4.08579 19.4142 3.75 19 3.75H14.75V3C14.75 2.58579 14.4142 2.25 14 2.25H10Z" fill="#36b4e5" />
                <path d="M13.0607 15L14.5303 16.4697C14.8232 16.7626 14.8232 17.2374 14.5303 17.5303C14.2374 17.8232 13.7626 17.8232 13.4697 17.5303L12 16.0607L10.5303 17.5303C10.2374 17.8232 9.76257 17.8232 9.46968 17.5303C9.17678 17.2374 9.17678 16.7626 9.46968 16.4697L10.9393 15L9.46967 13.5303C9.17678 13.2374 9.17678 12.7626 9.46967 12.4697C9.76256 12.1768 10.2374 12.1768 10.5303 12.4697L12 13.9393L13.4697 12.4697C13.7626 12.1768 14.2374 12.1768 14.5303 12.4697C14.8232 12.7626 14.8232 13.2374 14.5303 13.5303L13.0607 15Z" fill="#36b4e5" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.99142 7.91718C6.03363 7.53735 6.35468 7.25 6.73684 7.25H17.2632C17.6453 7.25 17.9664 7.53735 18.0086 7.91718L18.2087 9.71852C18.5715 12.9838 18.5715 16.2793 18.2087 19.5446L18.189 19.722C18.045 21.0181 17.0404 22.0517 15.7489 22.2325C13.2618 22.5807 10.7382 22.5807 8.25108 22.2325C6.95954 22.0517 5.955 21.0181 5.81098 19.722L5.79128 19.5446C5.42846 16.2793 5.42846 12.9838 5.79128 9.71852L5.99142 7.91718ZM7.40812 8.75L7.2821 9.88417C6.93152 13.0394 6.93152 16.2238 7.2821 19.379L7.3018 19.5563C7.37011 20.171 7.84652 20.6612 8.45905 20.747C10.8082 21.0758 13.1918 21.0758 15.5409 20.747C16.1535 20.6612 16.6299 20.171 16.6982 19.5563L16.7179 19.379C17.0685 16.2238 17.0685 13.0394 16.7179 9.88417L16.5919 8.75H7.40812Z" fill="#36b4e5" />
              </svg>
             </span>
             <p class="tooltip">حذف المجموعة</p>
           </div>
        </div>
      `
    }
  }




  selectedRow(row: any) {
    let clickedGroup = this.groupsList.find(group => group.name == row.row.groupName)
    this.Router.navigate([`cms/groups/group/${clickedGroup.id}`])
  }


  currentGroup: any
  clickChildButton(event: any) {
    if (event.action == 'editGroup') {
      this.currentAction = 'edit'
      this.modal_title = 'تعديل المجموعة'
      this.modal_button = 'تعديل المجموعة'
      this.currentGroup = this.groupsList[event.rowIndex]
      this.isShowGroupModal = true
      this.initGroupForm(this.currentAction)
      this.groupForm.get('name')?.setValue(this.currentGroup.name)
      this.groupForm.get('description')?.setValue(this.currentGroup.description)
      this.groupForm.get('note')?.setValue(this.currentGroup.note)
    } else if (event.action == 'editPermissions') {
      this.Router.navigate([`cms/groups/permissions/${this.groupsList[event.rowIndex].id}`])
    } else if (event.action == 'addUsers') {
      this.Router.navigate([`cms/groups/users/${this.groupsList[event.rowIndex].id}`])
    } else if (event.action == 'deleteGroup') {
      this.currentGroup = this.groupsList[event.rowIndex]
      this.confirmationDelete()
    }
  }





  // create group
  initGroupForm(type: any) {
    this.currentAction = type
    this.isShowGroupModal = true
    const fieldsCtrls: any = {};
    this.groupControls.forEach((field: any) => {
      fieldsCtrls[field.formControlName] = this.FormBuilder.control(null, field.isRequired ? Validators.required : null);
    });
    this.groupForm = this.FormBuilder.group(fieldsCtrls);
    this.handleControlsDisability()
    if (this.currentAction == 'edit') {
      this.groupForm.get('subGroup')?.disable()
    }
  }

  handleControlsDisability() {
    for (let i = 0; i < this.groupControls.length; i++) {
      this.groupControls[i].readonly ? this.groupForm.get(this.groupControls[i].name)?.disable() : this.groupForm.get(this.groupControls[i].name)?.enable()
    }
  }

  checkboxValue(event: any) {
    if (event && event.field.name == 'subGroup') {
      let control = this.groupControls.find(control => control.name == 'parentId')
      if (event.event) {
        // console.log(this.groupForm.get('parentId'))
        control ? control.isRequired = true : false
        control ? control.readonly = false : null
        this.groupForm.get('parentId')?.enable()
      } else {
        control ? control.isRequired = false : null
        control ? control.readonly = true : null
        this.groupForm.get('parentId')?.reset()
        this.groupForm.get('parentId')?.disable()
      }
    }
  }

  submitGroup() {
    this.groupForm.removeControl('subGroup')
    let parentIdControl = this.groupForm.get('parentId')
    parentIdControl && parentIdControl.value ? parentIdControl.setValue(parentIdControl.value.id) : null
    // console.log(this.groupForm.value)
    if (this.currentAction == 'add') {
      this.XhrService.post('v1/grouplevels/add', this.groupForm.value).subscribe(res => {
        // console.log(res)
        if (res.data) {
          this.resetAfterSubmit()
        }
      })
    } else if (this.currentAction == 'edit') {
      let payload = {
        id: this.currentGroup.id,
        name: this.groupForm.get('name')?.value,
        description: this.groupForm.get('description')?.value,
        note: this.groupForm.get('note')?.value,
      }
      // console.log(payload)
      this.XhrService.put('v1/grouplevels/update', payload).subscribe(res => {
        // console.log(res)
        if (res.data) {
          this.resetAfterSubmit()
        }
      })
    }

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
    // console.log(this.currentGroup.id)
    this.XhrService.delete('v1/grouplevels/deletesoft/' + this.currentGroup.id).subscribe(res => {
      // console.log(res)
      if (res.data) {
        this.getGroups()
      }
    })
  }

  // --- lookups

  groupsList: any[] = []
  getGroups() {
    this.data_table.data = []
    this.XhrService.get('v1/grouplevels/getall').subscribe(res => {
      // console.log(res)
      if (res.data) {
        this.groupsList = res.data
        for (let i = 0; i < this.groupsList.length; i++) {
          let parent:any = this.parentGroupsList.find((group:any) => group.id == this.groupsList[i].parentId)
          this.data_table.data.push({
            number: i + 1,
            groupName: this.groupsList[i].name,
            parent: parent ? parent.name : '-',
            members: this.groupsList[i].users.length,
            creationDate: this.SharedService.transformDateFormat(this.groupsList[i].createdDate),
            isShow:true
          })
        }
        this.appendCustomElements()
      }
    })
  }


  parentGroupsList = []
  getParentGroups() {
    let payload = {
      "pageNumber": 1,
      "pageSize": 50,
      "filter": {
        "isParent": true
      },
      "orderByValue": [{}]
    }
    this.XhrService.post('v1/grouplevels/getpaged', payload).subscribe(res => {
      this.getGroups()
      if (res.data.data) {
        let response = res.data.data
        this.parentGroupsList = response
        let options: any[] = []
        for (let i = 0; i < response.length; i++) {
          options.push({ name: response[i].name, id: response[i].id })
        }
        let control = this.groupControls.find(control => control.name == 'parentId')
        control ? control.options = options : null
      }
    })
  }

  resetAfterSubmit() {
    this.isShowGroupModal = false
    this.getGroups()
    this.getParentGroups()
    this.groupForm.reset()
    this.groupForm.get('parentId')?.disable()
  }
}
