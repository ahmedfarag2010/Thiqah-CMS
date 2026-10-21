import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { XhrService } from '../../../../shared/services/xhr/xhr.service';
import { FBControl } from '../../../../shared/interfaces/fbcontrol';


@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class TenantsComponent implements OnInit {

  data_table: any = {}
  tenantsList: any[] = []

  isShowTenantModal = false
  tenantForm: FormGroup
  currentAction = 'add'
  modalTitle = 'إنشاء مستأجر جديد'
  modalButton = 'إنشاء مستأجر'
  currentTenant: any

  tenantControls: FBControl[] = [
    {
      label: 'الاسم',
      name: 'name',
      formControlName: 'name',
      type: 'textbox',
      readonly: false,
      placeholder: 'أكتب اسم المستأجر',
      icon: '',
      class: '',
      cols: 12,
      value: [],
      isRequired: true
    },
    {
      label: 'الوصف',
      name: 'description',
      formControlName: 'description',
      type: 'textbox',
      readonly: false,
      placeholder: 'أكتب وصف المستأجر',
      icon: '',
      class: '',
      cols: 12,
      value: [],
      isRequired: true
    },
    {
      label: 'البادئة',
      name: 'prefix',
      formControlName: 'prefix',
      type: 'textbox',
      readonly: false,
      placeholder: 'أكتب البادئة',
      icon: '',
      class: '',
      cols: 12,
      value: [],
      isRequired: true
    },
    {
      label: 'اسم البادئة',
      name: 'prefixName',
      formControlName: 'prefixName',
      type: 'textbox',
      readonly: false,
      placeholder: 'أكتب اسم البادئة',
      icon: '',
      class: '',
      cols: 12,
      value: [],
      isRequired: true
    }
  ]

  constructor(
    private XhrService: XhrService,
    private FormBuilder: FormBuilder,
    private confirmationService: ConfirmationService
  ) {
    this.data_table = {
      cols: [
        {
          label: 'الرقم',
          key: 'number'
        },
        {
          label: 'الاسم',
          key: 'name'
        },
        {
          label: 'الوصف',
          key: 'description'
        },
        {
          label: 'البادئة',
          key: 'prefix'
        },
        {
          label: 'اسم البادئة',
          key: 'prefixName'
        },
        {
          label: 'الإجراء',
          key: 'actions'
        }
      ],
      data: []
    }
  }

  ngOnInit(): void {
    this.getTenants()
  }

  getTenants() {
    this.data_table.data = []
    this.XhrService.get('v1/tenant/getall').subscribe(res => {
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.data || [])
      this.tenantsList = list
      for (let i = 0; i < this.tenantsList.length; i++) {
        this.data_table.data.push({
          number: i + 1,
          name: this.tenantsList[i].name,
          description: this.tenantsList[i].description,
          prefix: this.tenantsList[i].prefix,
          prefixName: this.tenantsList[i].prefixName,
          isShow: true
        })
      }
      this.appendCustomElements()
    })
  }

  appendCustomElements() {
    for (let i = 0; i < this.data_table.data.length; i++) {
      this.data_table.data[i].actions = `
        <div class="data-table__actions">
          <div data-index=${i} has-event='true' data-event='click' data-action='editTenant'>
            <span class="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M21.4549 5.41575C21.6471 5.70687 21.615 6.10248 21.3588 6.35876L12.1664 15.5511C12.0721 15.6454 11.9545 15.7128 11.8256 15.7465L7.99716 16.7465C7.87229 16.7791 7.74358 16.7784 7.62265 16.7476C7.49408 16.7149 7.37431 16.6482 7.27729 16.5511C7.08902 16.3629 7.01468 16.0889 7.08197 15.8313L8.08197 12.0028C8.11144 11.89 8.16673 11.7786 8.24322 11.6912L17.4697 2.46967C17.5504 2.38891 17.6477 2.32846 17.7536 2.29163C17.8321 2.26432 17.9153 2.25 18 2.25C18.1989 2.25 18.3897 2.32902 18.5303 2.46967L21.3588 5.2981C21.3954 5.33471 21.4274 5.37416 21.4549 5.41575ZM19.7678 5.82843L18 4.06066L9.48184 12.5788L8.85685 14.9716L11.2496 14.3466L19.7678 5.82843Z" fill="#36B4E5"/>
                <path d="M19.6414 17.1603C19.9148 14.8227 20.0018 12.4688 19.9023 10.1208C19.8976 10.0084 19.9399 9.89898 20.0194 9.81942L21.0027 8.83609C21.1236 8.71519 21.3302 8.79194 21.3415 8.96254C21.5265 11.7522 21.4564 14.5545 21.1312 17.3346C20.8946 19.3571 19.2703 20.9421 17.2583 21.167C13.7917 21.5544 10.2083 21.5544 6.74177 21.167C4.72971 20.9421 3.10538 19.3571 2.86883 17.3346C2.45429 13.7903 2.45429 10.2097 2.86883 6.66543C3.10538 4.6429 4.72971 3.05789 6.74177 2.83301C9.37152 2.5391 12.0685 2.46815 14.7306 2.62016C14.9022 2.62996 14.9804 2.83757 14.8589 2.95909L13.8664 3.95165C13.7877 4.03034 13.6798 4.07261 13.5685 4.06885C11.3421 3.99376 9.10055 4.07872 6.90838 4.32373C5.57827 4.47239 4.51278 5.522 4.35867 6.83968C3.95767 10.2682 3.95767 13.7318 4.35867 17.1603C4.51278 18.478 5.57827 19.5276 6.90838 19.6763C10.2642 20.0513 13.7358 20.0513 17.0916 19.6763C18.4218 19.5276 19.4872 18.478 19.6414 17.1603Z" fill="#36B4E5"/>
              </svg>
            </span>
            <p class="tooltip">تعديل المستأجر</p>
          </div>
          <div data-index=${i} has-event='true' data-event='click' data-action='deleteTenant'>
            <span class="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2.25C9.58579 2.25 9.25 2.58579 9.25 3V3.75H5C4.58579 3.75 4.25 4.08579 4.25 4.5C4.25 4.91421 4.58579 5.25 5 5.25H19C19.4142 5.25 19.75 4.91421 19.75 4.5C19.75 4.08579 19.4142 3.75 19 3.75H14.75V3C14.75 2.58579 14.4142 2.25 14 2.25H10Z" fill="#36b4e5" />
                <path d="M13.0607 15L14.5303 16.4697C14.8232 16.7626 14.8232 17.2374 14.5303 17.5303C14.2374 17.8232 13.7626 17.8232 13.4697 17.5303L12 16.0607L10.5303 17.5303C10.2374 17.8232 9.76257 17.8232 9.46968 17.5303C9.17678 17.2374 9.17678 16.7626 9.46968 16.4697L10.9393 15L9.46967 13.5303C9.17678 13.2374 9.17678 12.7626 9.46967 12.4697C9.76256 12.1768 10.2374 12.1768 10.5303 12.4697L12 13.9393L13.4697 12.4697C13.7626 12.1768 14.2374 12.1768 14.5303 12.4697C14.8232 12.7626 14.8232 13.2374 14.5303 13.5303L13.0607 15Z" fill="#36b4e5" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.99142 7.91718C6.03363 7.53735 6.35468 7.25 6.73684 7.25H17.2632C17.6453 7.25 17.9664 7.53735 18.0086 7.91718L18.2087 9.71852C18.5715 12.9838 18.5715 16.2793 18.2087 19.5446L18.189 19.722C18.045 21.0181 17.0404 22.0517 15.7489 22.2325C13.2618 22.5807 10.7382 22.5807 8.25108 22.2325C6.95954 22.0517 5.955 21.0181 5.81098 19.722L5.79128 19.5446C5.42846 16.2793 5.42846 12.9838 5.79128 9.71852L5.99142 7.91718ZM7.40812 8.75L7.2821 9.88417C6.93152 13.0394 6.93152 16.2238 7.2821 19.379L7.3018 19.5563C7.37011 20.171 7.84652 20.6612 8.45905 20.747C10.8082 21.0758 13.1918 21.0758 15.5409 20.747C16.1535 20.6612 16.6299 20.171 16.6982 19.5563L16.7179 19.379C17.0685 16.2238 17.0685 13.0394 16.7179 9.88417L16.5919 8.75H7.40812Z" fill="#36b4e5" />
              </svg>
            </span>
            <p class="tooltip">حذف المستأجر</p>
          </div>
        </div>
      `
    }
  }

  clickChildButton(event: any) {
    this.currentTenant = this.tenantsList[event.rowIndex]
    if (event.action == 'editTenant') {
      this.initTenantForm('edit')
      this.tenantForm.get('name')?.setValue(this.currentTenant.name)
      this.tenantForm.get('description')?.setValue(this.currentTenant.description)
      this.tenantForm.get('prefix')?.setValue(this.currentTenant.prefix)
      this.tenantForm.get('prefixName')?.setValue(this.currentTenant.prefixName)
    } else if (event.action == 'deleteTenant') {
      this.confirmationDelete()
    }
  }

  initTenantForm(type: string = 'add') {
    this.currentAction = type
    this.modalTitle = type == 'edit' ? 'تعديل المستأجر' : 'إنشاء مستأجر جديد'
    this.modalButton = type == 'edit' ? 'تعديل المستأجر' : 'إنشاء مستأجر'
    this.isShowTenantModal = true
    const fieldsCtrls: any = {}
    this.tenantControls.forEach((field: any) => {
      fieldsCtrls[field.formControlName] = this.FormBuilder.control(null, field.isRequired ? Validators.required : null)
    })
    this.tenantForm = this.FormBuilder.group(fieldsCtrls)
  }

  submitTenant() {
    const request = this.currentAction == 'edit'
      ? this.XhrService.put('v1/tenant/update', {
        id: this.currentTenant.id,
        name: this.tenantForm.get('name')?.value,
        description: this.tenantForm.get('description')?.value,
        prefix: this.tenantForm.get('prefix')?.value,
        prefixName: this.tenantForm.get('prefixName')?.value
      })
      : this.XhrService.post('v1/tenant/add', this.tenantForm.value)

    request.subscribe(res => {
      if (res.data) {
        this.isShowTenantModal = false
        this.tenantForm.reset()
        this.getTenants()
      }
    })
  }

  confirmationDelete() {
    this.confirmationService.confirm({
      accept: () => {
        this.deleteTenant()
      },
      reject: () => {
      }
    })
  }

  deleteTenant() {
    this.XhrService.delete('v1/tenant/deletesoft/' + this.currentTenant.id).subscribe(res => {
      if (res.data) {
        this.getTenants()
      }
    })
  }
}
