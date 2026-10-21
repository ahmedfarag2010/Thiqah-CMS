import { Component, signal, ViewChild, ElementRef, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { XhrService } from '../../services/xhr/xhr.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { SharedService } from '../../services/shared/shared.service';


interface FileObject {
  selectedFile?: any;
  fileSize?: any;
  imagePreview?: any;
  fileName?: any;
}


@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.scss',
})




export class UploadFilesComponent implements OnInit {

  allowedFiles = ["jpg", "jpeg", "png","pdf","zip","csv","doc","docx","pptx"]

  selectedFiles: FileObject[] = []
  @Output() uploadedFilesValue = new EventEmitter();
  @Input() isClearing = new BehaviorSubject<boolean>(false);

  constructor(
    private XhrService: XhrService,
    private SharedService:SharedService
  ) { }

  imageName = signal('');
  fileSize = signal(0);
  uploadProgress = signal(0);
  imagePreview = signal('');
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: boolean = false;





  ngOnInit(): void {
    this.isClearing.subscribe(v => {
      this.selectedFiles = []
    });
  }

  // Handler for file input change
  onFileChange(event: any): void {
    const files = event.target.files as File | null;
    this.uploadFiles(files);
  }

  // Handler for file drop
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    // const files = event.dataTransfer?.files[0] as File | null;
    const dataTransfer = new DataTransfer
    // for(let i = 0; i < event.dataTransfer?.files.length; i++){
    //   dataTransfer.items.add(event.dataTransfer?.files[i])
    // }
    // this.uploadFiles(files);
  }

  // Prevent default dragover behavior
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  uploadFiles(files: any) {
    if (this.isAllowedFiles(files)) {
      if (files.length > 0) {
        const formData = new FormData();
        let arr: FileObject[] = []
        for (let i = 0; i < files.length; i++) {
          let obj: FileObject = {}
          obj.selectedFile = files[i]
          obj.fileSize = Math.round(files[i].size / 1024)
          let reader = new FileReader();
          reader.onload = function () {
            obj.imagePreview = reader.result
          }
          reader.readAsDataURL(files[i])
          obj.fileName = files[i].name
          arr.push(obj)
          formData.append('files', files[i])
        }
        this.selectedFiles = this.selectedFiles.concat(arr)
        this.uploadFilesToServer(formData)
      }
    } else {
      this.SharedService.showToaster('error', 'خطأ', 'صيغة الملف غير مدعومة', 5000)
    }

  }


  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.uploadedFilesToServer.splice(index, 1);
    this.emitValue()
  }


  emitValue() {
    this.uploadedFilesValue.emit(this.uploadedFilesToServer)
  }


  uploadedFilesToServer: any = []
  uploadFilesToServer(formData: any) {
    this.XhrService.post(`v1/files/uploadtosanstorage?storageType=2&isPublic=true&appCode=CMS`, formData).subscribe(res => {
      let uploadedValue = []
      if (res.data) {
        for (let i = 0; i < res.data.length; i++) {
          uploadedValue.push({ name: res.data[i].name, id: res.data[i].id })
        }
        this.uploadedFilesToServer = [...uploadedValue,...this.uploadedFilesToServer]
        this.emitValue()
      }
    })
  }

  isAllowedFiles(value: any) {
    let selectedFilesExtentions = []
    let isAllowed = true
    for (let i = 0; i < value.length; i++) {
      selectedFilesExtentions.push(value[i].name.split('.').pop())
    }
    for (let i = 0; i < selectedFilesExtentions.length; i++) {
      if (!this.allowedFiles.includes(selectedFilesExtentions[i])) {
        isAllowed = false
      }
    }
    return isAllowed
    // console.log(selectedFilesExtentions)
  }


}
