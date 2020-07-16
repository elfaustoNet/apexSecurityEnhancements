import { LightningElement, track, wire } from 'lwc';
import getAccountList from '@salesforce/apex/AccountAccessTesterController.getAccountList';
import getResults from '@salesforce/apex/AccountAccessTesterController.getResults';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import getAccountPickListValues from '@salesforce/apex/AccountAccessTesterController.getAccountPickListValues';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import TYPE_FIELD from '@salesforce/schema/Account.Type';
import RATING_FIELD from '@salesforce/schema/Account.Rating';

export default class AccountAccessTester extends LightningElement {

    @track actionValue = '';
    @track accountValue = '';
    @track securityMethodValue = '';
    @track accountOptions = [];
    @track securityMethodOptions = [];
    @track displayAccountOption = false;
    @track displaySecurityMethod = false;
    @track displayOutput = false;
    @track displayButton = false;
    @track displayInput = false;

    @track queryExecuted;
    @track queryResults;
    @track modifiedIndexes;
    @track removedFields;
    typeValue='';
    industryValue ='';
    ratingValue ='';
    nameValue = '';
    accountNumberValue ='';
    accounts;

    //question how to keep wire for execution in load
 
  
    /*@wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: TYPE_FIELD,
    })
    picklistValues;*/

   


    get actionOptions() {
        //{label: '--Select One--', value: ''}, 
        return [
            
            {label: 'Read', value: 'read'}, 
            {label: 'Create', value: 'create'}, 
            {label: 'Update', value: 'update'} 
        ];
    }

    get industryOptions() {
        //  {label: '--Select One--', value: ''},
        return [
           
            {label: 'Biotechnology', value: 'Biotechnology'}, 
            {label: 'Communications', value: 'Communications'}, 
            {label: 'Consulting', value: 'Consulting'}, 
            {label: 'Electronics', value: 'Electronics'}, 
            {label: 'Finance', value: 'Finance'},
            {label: 'Other', value: 'Other'}
            
            
        ];
    }

    get typeOptions() {
        //{label: '--Select One--', value: ''}, 
        return [
           
            {label: 'Prospect', value: 'Prospect'}, 
            {label: 'Technology Partner', value: 'Technology Partner'}, 
            {label: 'Customer - Direct', value: 'Customer - Direct'}, 
            {label: 'Customer - Channel', value: 'Customer - Channel'}, 
            {label: 'Other', value: 'Other'} 
        ];
    }

    get ratingOptions() {
        //{label: '--Select One--', value: ''}, 
        return [
            {label: 'Hot', value: 'Hot'}, 
            {label: 'Warm', value: 'Warm'}, 
            {label: 'Cold', value: 'Code'} 
        ];
    }

    handleActionChange(event) {
        this.actionValue = event.detail.value;
        this.displayOutput = false;
        this.displayButton = true;
        if (this.actionValue == 'read')
        {
            this.displayAccountOption = true;
            this.displaySecurityMethod = true;
            this.displayInput = false;
            this.populateAccountOptions();
        }    
        else {
            this.displayAccountOption = false;
            this.displaySecurityMethod = true;
            this.displayInput = true;
            //this.populatePicklists();
        }
        this.populateSecurityMethodOptions();
    }
    handleAccountChange(event) {
        this.accountValue = event.detail.value;
    }
    handleSecurityMethodChange(event) {
        this.securityMethodValue = event.detail.value;
        this.displayOutput = false;
    }

    handleTypeChange(event) {
        this.typeValue = event.detail.value;
        
    }

    handleRatingChange(event) {
        this.ratingValue = event.detail.value;
       
    }
    handleIndustryChange(event) {
        this.industryValue = event.detail.value;
        
    }
    handleNameChange(event) {
        this.nameValue = event.detail.value;
    
    }
    handleAccountNumberChange(event) {
        this.accountNumberValue = event.detail.value;
    }

    populateAccountOptions() {
        //Call Method to get 
        getAccountList()
        .then (result => {
            this.accounts = result;
            this.accountOptions = [];
          //  this.accountOptions.push({label: '--Select One--', value: ''});
            console.log('accounts $$ ' + JSON.stringify(this.accounts));
            console.log('account options 2 ' + JSON.stringify(this.accountOptions));
            this.accounts.forEach((acct) => {
                console.log('acct ' + JSON.stringify(acct));
                this.accountOptions.push({label: acct.Name, value: acct.Id});
            })

            

        })
        .catch(error => {
            console.log('error $$ ' +  error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error,
                    variant: 'error'
                })
            ); 
        });
        console.log('accountOptions $$ ' + JSON.stringify(this.accountOptions));
    }

    populateSecurityMethodOptions() { 
        this.securityMethodOptions = [];
       // this.securityMethodOptions.push({label: '--Select One--', value: ''});
        if (this.actionValue == 'read')
        {
            this.securityMethodOptions.push({label: 'WITH SECURITY_ENFORCED', value: 'securityEnforced'});
        }
        this.securityMethodOptions.push({label: 'Strip.inAccessible()', value: 'inAccessible'});

    }

    /*populatePicklists() {
        getAccountPickListValues({fieldApiName: 'Industry'})
        .then((result => {
            console.log('result industry ' + result);
        })
        .catch(error => {
            console.log('error getting industry picklist');
        })

       /* getAccountickListValues({fieldApiName: 'Type'})
        .then((result => {
            console.log('result type ' + result);
        })
        .catch(error => {
            console.log('error getting type picklist');
        });

        getAccountickListValues({fieldApiName: 'Rating'})
        .then((result => {
            console.log('result rating ' + result);
        })
        .catch(error => {
            console.log('error getting rating picklist');
        });* /
    }*/

    /*clearForms() {
        this.accountValue = '';
        this.securityMethodValue = '';
        this.queryExecuted ='';
        this.queryResults = '';
        this.modifiedIndexes ='';
        this.removedFields = '';
        this.typeValue='';
        this.industryValue ='';
        this.ratingValue ='';
        this.nameValue = '';
        this.accountNumberValue ='';
    }*/

    handleClick() {
        this.displayOutput = true;
        if (this.actionValue == '') {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'You need to select an action',
                    variant: 'error'
                })
            ); 
        }
        else if (this.actionValue == 'read' && this.accountValue == '') {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'You need to select an account',
                    variant: 'error'
                })
            ); 
        }
        else if (this.securityMethodValue == '') {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'You need to select a security method',
                    variant: 'error'
                })
            ); 
        }
        else {
            console.log('all clear ');
            let acct = { 'sobjectType': 'Account' };
            acct.Name = this.nameValue;
            acct.AccountNumber = this.accountNumberValue;
            acct.Industry = this.industryValue;
            acct.Type = this.typeValue;
            acct.Rating = this.ratingValue;
            console.log('acct $$ ', acct);
            getResults({method: this.actionValue, accountId: this.accountValue, securityMethod: this.securityMethodValue, accountRecord: acct})
            .then(results => {
                console.log('in get results ' + JSON.stringify(results));
                this.queryExecuted = results.queryExecuted;
                this.queryResults = results.result;
                this.modifiedIndexes = results.modifiedIndexes;
                this.removedFields = results.removedFields;

            })
            .catch(error => {
                console.log('error ' + JSON.stringify(error));
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'There was an error ' + error.body.message,
                        variant: 'error'
                    })
                ); 
            })
        }

    }


}