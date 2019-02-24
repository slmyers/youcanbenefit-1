import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment'
@Injectable()
export class QueryDryRunService {
    
    constructor(
        private fb: FormBuilder,
        private http: HttpClient
    ){}

    public runQuery: (value: any) => {[key: string]: any} = value => {
        return this.http.post(`${environment.api}/api/notification/`, value)
    }
 

    public buildQuery: (value: any) => {[key: string]: any} = (value) => {
        console.log(".....")
        console.log("value", value)
        console.log(".....")
        function pluckQuestion({ question }){
            return question;
        }
        function getKeyValue(condition){
            switch(condition.question.type) {
                case "integer": {
                    return 0
                }

                case "boolean": {
                    return true;
                }

                case "number": {
                    return 0;
                }

                default: {
                    console.log(condition.question.type)
                    return 0;
                }
            }
        }
        function buildGroup(group, condition){
            if (condition && Object.keys(condition).length) {
                const id = condition.question.id
                const control = new FormControl(getKeyValue(condition))
                group[id] = control
            }
            return group
        }
        const questions = value.conditions.map(pluckQuestion)
        const query = this.fb.group(value.conditions.reduce(buildGroup, {}))
        return { questions, query }
    }
}