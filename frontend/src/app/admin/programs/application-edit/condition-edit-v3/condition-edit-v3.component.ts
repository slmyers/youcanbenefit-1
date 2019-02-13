import { Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { Key } from '../../../models'
import { ProgramConditionClass } from '../../services/program-condition.class';
import { ProgramModelService } from '../../services/program-model.service'
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators'

@Component({
  selector: 'app-condition-edit-v3',
  templateUrl: './condition-edit-v3.component.html',
  styleUrls: ['./condition-edit-v3.component.css']
})
export class ConditionEditV3Component implements OnInit, OnDestroy {
  @Input() condition: ProgramConditionClass;
  @Output() remove = new EventEmitter();
  @Output() keyChange = new EventEmitter();
  valueWatcherNumber: Subscription;
  valueWatcherBoolean: Subscription;
  keys: Observable<Key[]>;
  keyNameClasses = { 'ng-invalid': false };
  optional = {
    boolean: false,
    number: false,
  };
  readonly qualifiers = [
    { display: '>', value: 'greaterThan' },
    { display: '>=', value: 'greaterThanOrEqual'},
    { display: '=', value: 'equal' },
    { display: '<=', value: 'lessThanOrEqual' },
    { display: '<', value: 'lessThan' },
  ];


  constructor(private ps: ProgramModelService) { }

  ngOnInit() {
    this.keys = this.ps.keys.pipe(map((keys: any[]) => keys.sort( (a, b) => a.name.localeCompare(b.name)) ));
  }

  ngOnDestroy() {
    if (this.valueWatcherNumber && !this.valueWatcherNumber.closed) this.valueWatcherNumber.unsubscribe();

    if (this.valueWatcherBoolean && !this.valueWatcherBoolean.closed) this.valueWatcherBoolean.unsubscribe();
  }

  private _getSelectedKeyName(): string {
    return this.condition.form.value.key.name;
  }

  isKeySelected = (option: any): boolean => {
    return option && option.name === this._getSelectedKeyName();
  };



  handleKeyChange($event) {
    const booleanValueStrategy = form => {
      form.get('value').setValue(true);
      this.optional.boolean = true;
      this.optional.number = false;
    };

    const numberValueStrategy = form => {
      form.get('value').setValue(0);
      form.get('qualifier').setValue('lessThanOrEqual');
      this.optional.boolean = false;
      this.optional.number = true;
    };

    const name = $event.value.name;
    this.keys
      .pipe(take(1), map(keys => keys.find(k => k.name === name)))
      .subscribe(key => {
        if (key){
          this.condition.form.get('key').setValue(key);
          this.condition.form.get('type').setValue(key.type);

          if (key.type === 'boolean')
            booleanValueStrategy(this.condition.form);
          else 
            numberValueStrategy(this.condition.form);

          setTimeout(() => {
            if (this.condition.form.getError('invalid_key') !== null) {
              this.keyNameClasses['ng-invalid'] = true;
            } else {
              this.keyNameClasses['ng-invalid'] = false;
            }
            this.keyChange.emit();
          }, 0);
        }
      });
  }

  getKeyType = (): string => {
    return this.condition.form.value.key.type;
  };

  isQualifierSelected = (qualifierValue: any) => {
    return this.getKeyType() !== 'boolean' && this.condition.form.get('qualifier').value === qualifierValue;
  };

  deleteCondition() {
    this.remove.emit(this.condition)
  }

}
