import { Any } from "typeorm";

export function validationCoupon(codestring:string){
    const ruleCode = /^[a-zA-Z0-9]{8}/;
    const testCode = ruleCode.test(codestring) && codestring.length == 8; 
    return testCode
}

export function validationDate(dateString:string){
    const ruleDate = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/;
    const testDate = ruleDate.test(dateString);
    return testDate
}

export function getErrors(code:string, expiredAt: string, assignedAt:string){ 
        let errors = {}
        if(!validationDate(expiredAt))
             errors = {...errors, dateAssignedAt: 'invalid format'}

        if(!validationDate(assignedAt))
            errors = {...errors, dateExpiresAt: 'invalid format'}

        if(!validationCoupon(code))
            errors = {...errors, dateCode: 'invalid format: must contain 8 characters and be alphanumeric'}
        return errors

}
