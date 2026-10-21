import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FBControl } from '../../interfaces/fbcontrol'




@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnInit {
  createTopicForm: FormGroup
  @Output() commentValue = new EventEmitter();
  @Input() comments:any[]
  @Input() isWrite:boolean


  commentControl: FBControl = {
    label: '',
    placeholder: 'أكتب الملاحظات هنا',
    type: 'textbox',
    name: 'comment'
  }

  addCommentForm = new FormGroup({
    comment: new FormControl(null, Validators.required)
  })

  ngOnInit(): void {
    console.log(this.comments)
    this.addCommentForm.controls['comment'].valueChanges.subscribe(
      (value) => {
        this.commentValue.emit(value)
      })
  }

  // enteredComment(event:any){
  //   console.log(event)
  // }

  submitComment(form:any){
    // console.log(form)
  }

}
