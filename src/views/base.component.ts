import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

interface IFormBuilder {
  regex?: RegExp;
  required?: boolean;
  minlength?: string | number;
  maxlength?: string | number;
  messages: {
    label?: string;
    placeholder?: string;
    minlength?: string;
    maxlength?: string;
    required?: string;
    regex?: string;
  };
}

export class BaseComponent {
  public masks = {};
  public errors: boolean;
  public form: FormGroup;
  public isLogged: boolean;
  public formSubmitted: boolean;
  public validationLengths: any;
  public loading: boolean = false;
  public fieldProps: { [key: string]: IFormBuilder };
  public validationMessages: { [key: string]: string };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route?: ActivatedRoute
  ) {
    this.errors = false;
    this.formSubmitted = false;
  }

  public addMask = (id: string) => {
    this.masks[id] = true;
    this.loading = true;
  };

  public removeMask = (id: string) => {
    delete this.masks[id];
    this.loading = Object.keys(this.masks).length > 0;
  };

  public navigate = (page, data?: any) => {
    const stringJSON = JSON.stringify(data);
    const string64 = btoa(stringJSON);
    data
      ? this.router.navigate([page], { queryParams: { token: string64 } })
      : this.router.navigateByUrl(page);
  };

  public getParameters = () => {
    if (!this.route) return;
    const parameters = this.route.snapshot.queryParams;
    if (!parameters || Object.values(parameters).length === 0) return;

    return JSON.parse(atob(parameters.token));
  };

  public ngOnInit() {
    const fields = Object.keys(this.fieldProps);
    if (fields) {
      this.form = this.createForm(fields, this.fieldProps).form;
    }
  }

  public createForm(properties?: string[], fieldProps?: {}) {
    const fieldsConfig = {};
    this.validationMessages = {};
    this.validationLengths = {};

    properties.map(field => {
      fieldsConfig[field] = ["", this.getValidator(fieldProps[field])];
      this.validationMessages[field] = fieldProps[field].messages;
      this.validationLengths[field] = {
        maxLength: fieldProps[field].maxlength,
        minLength: fieldProps[field].minlength
      };
    });
    return {
      form: this.formBuilder.group(fieldsConfig),
      validationMessages: this.validationMessages,
      validationLengths: this.validationLengths
    };
  }

  public getValidator(fieldProps: IFormBuilder) {
    const validators = [];
    fieldProps.required && validators.push(Validators.required);
    fieldProps.minlength &&
      validators.push(Validators.minLength(fieldProps.minlength as number));
    fieldProps.maxlength &&
      validators.push(Validators.maxLength(fieldProps.maxlength as number));
    fieldProps.regex && validators.push(Validators.pattern(fieldProps.regex));

    return validators;
  }

  public showValidations(form?: any, fields?: string[]) {
    const evalForm = form || this.form;
    const formFields = fields || Object.keys(this.fieldProps);

    formFields.forEach((item, index) => {
      evalForm.controls[formFields[index]].active =
        evalForm.controls[formFields[index]].errors &&
        evalForm.controls[formFields[index]].errors.required &&
        evalForm.controls[formFields[index]].invalid;
    });

    if (form) return evalForm;
  }
}
