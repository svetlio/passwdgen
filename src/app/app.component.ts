import {Component, OnInit, Input, ElementRef} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(600 )
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(600, style({opacity: 0})))
    ])
  ]
})
export class AppComponent implements OnInit{
  title = 'passwd-gen';

  allCapsAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  allLowerAlpha = "abcdefghijklmnopqrstuvwxyz";
  allUniqueChars = "~!@#$%^&*()_+-=[]{}|;:,./<>?";
  allNumbers = "0123456789";

  base = [this.allCapsAlpha, this.allNumbers, this.allLowerAlpha, this.allUniqueChars];

  allCapsAlphaChecked = true;
  allLowerAlphaChecked = true;
  allNumbersChecked = true;
  allUniqueCharsChecked = false;
  disabled = false;
  copied = '';

  resultString = new FormControl({value: '', disabled: true});
  resultDatetime: string;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private clipboard: Clipboard,
    private _elementRef: ElementRef
  ) { }

  ngOnInit() {
    this._elementRef.nativeElement.removeAttribute("ng-version");

    this.form = this.formBuilder.group({
      strLength: new FormControl(16),
      allCapsAlphaChecked: new FormControl(true),
      allLowerAlphaChecked: new FormControl(true),
      allNumbersChecked: new FormControl(true),
      allUniqueCharsChecked: new FormControl(false),
    });
  }

  generateRandomString(): void {
    const formValue = this.form.value;

    let str = '';
    if (formValue.allCapsAlphaChecked) {
      str = str + this.allCapsAlpha;
    }
    if (formValue.allLowerAlphaChecked) {
      str = str + this.allLowerAlpha;
    }
    if (formValue.allNumbersChecked) {
      str = str + this.allNumbers;
    }
    if (formValue.allUniqueCharsChecked) {
      str = str + this.allUniqueChars;
    }

    let base = str;

    const generator = (base, len) => {
      return [...Array(len)]
        .map(i => base[Math.random()*base.length|0])
        .join('');
    };

    let result = generator(base, formValue.strLength);

    this.resultString.setValue(result);

    //
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    console.log(dateTime);

    this.resultDatetime = dateTime;
  }

  copyResultString(): void {
    console.log(this.resultString.value);
    this.clipboard.copy(this.resultString.value);

    this.copied = 'copied';

    // ToDo: use css class to set for fade-out
    setTimeout(() => {
      this.copied = '';
    }, 2000);
  }
}
