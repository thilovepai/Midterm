import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-create-bmi',
  templateUrl: './create-bmi.component.html',
  styleUrls: ['./create-bmi.component.css']
})
export class CreateBmiComponent implements OnInit {
  errorMsg: string;
  form: FormGroup;
  personID: any;
  items: any;
  errMsg: string;
  
  constructor(private builder: FormBuilder,
    private router: Router,
    private productSV: ProductService,
    private activateRouter: ActivatedRoute,
    private alertSV: AlertService) {
    this.CrateForm();
    this.activateRouter.params.forEach(
      params => {
        this.personID = params.id;
        this.form.controls['PERSION_CODE'].setValue(this.personID);
      }
    )
  }

  ngOnInit() {
  }
  
  private CrateForm() {
    this.form = this.builder.group({
      WEIGHT: ['', [Validators.required]],
      HEIGHT: ['', [Validators.required]],
      RESULT: [''],
      PERSION_CODE: [''],
    });
  }
  onSubmit() {
    if (this.form.invalid) {
      console.log(this.form.value);
      this.alertSV.notify('ข้อมูลไม่ครบ', 'error');
    } else if (Number(this.form.get('WEIGHT').value) <= 0
      || Number(this.form.get('WEIGHT')) === NaN) {
      this.alertSV.notify('น้ำหนักไม่ถูกต้อง', 'error');
    } else if (Number(this.form.get('HEIGHT').value) <= 0
      || Number(this.form.get('HEIGHT')) === NaN) {
      this.alertSV.notify('ส่วนสูงไม่ถูกต้อง', 'error');
    } else {
      const weigth = Number(this.form.get('WEIGHT').value);
      const heigth = Number(this.form.get('HEIGHT').value);
      this.form.controls['RESULT'].setValue(Math.round(weigth / Math.pow(heigth * 0.01, 2)));
      this.productSV
        .createbmi(JSON.stringify(this.form.value))
        .then(res => {
          this.router.navigate(['/', 'home']);
          this.alertSV.notify('เพิ่มข้อมูลสำเร็จ', 'success');
        })
        .catch(err => this.errorMsg = err);
    }
  }

}
