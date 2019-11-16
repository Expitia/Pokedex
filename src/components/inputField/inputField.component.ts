import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-input-field",
  templateUrl: "./inputField.component.html",
  styleUrls: ["./inputField.component.css"]
})
export class InputField implements OnInit {
  @Input() public fieldName: string;
  @Input() public showHelp: boolean;
  @Input() public inputType: string;
  @Input() public inputForm: FormGroup;
  @Input() public formSubmitted: boolean;
  @Input() public validationLengths: any;
  @Input() public fieldNameLabel: string;
  @Input() public validationMessages: any;
  @Input() public readOnly: boolean = false;
  @Input() public disabled: boolean = false;

  public ngOnInit() {}

  public onKeyUp(event) {
    const value = event.srcElement.value;
    this.formSubmitted = !!value;
  }
}
