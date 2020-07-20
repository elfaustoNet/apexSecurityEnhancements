public with sharing class AccountAccessTesterController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList() {
        List<Account> accountList = new List<Account>();
        accountList = [Select Name, Id From Account order by Name ASC limit 100];
        return accountList;
    }


    @AuraEnabled
    public static TesterResults getResults(String method, String accountId, String securityMethod, Account accountRecord) {
        system.debug('in getResults $$ ' + method + ' ' + accountId + ' ' + securityMethod);
        TesterResults results = new TesterResults();
        if (method == 'read') {
            if (securityMethod == 'securityEnforced') {
                try {
                    List<Account> accountResults = [select Id, Name, accountNumber, Type, Industry, Rating from Account where Id = :accountId WITH SECURITY_ENFORCED limit 1];
                    results.queryExecuted = '[select Id, Name, accountNumber, Type, Industry, Rating from Account where Id = :accountId WITH SECURITY_ENFORCED limit 1]';
                    results.result = JSON.serialize(accountResults);
                }catch (System.QueryException ex) {
                    throw new AuraHandledException('Something went wrong: ' + ex.getMessage());  
                }        

            }
            else if (securityMethod == 'inAccessible') {
                //List<Account> tmpList = [select Id, Name, accountNumber, Type, Industry, Rating from Account where Id = :accountId limit 1];
                //SObjectAccessDecision securityDecision = Security.stripInaccessible(AccessType.READABLE, tmpList);
                SObjectAccessDecision securityDecision = Security.stripInaccessible(AccessType.READABLE,[select Id, Name, accountNumber, Type, Industry, Rating from Account where Id = :accountId limit 1]);
                results.queryExecuted = ' SObjectAccessDecision securityDecision = Security.stripInaccessible(AccessType.READABLE,[select Id, Name, accountNumber, Type, Industry, Rating from Account where Id = :accountId limit 1]);';
                List<Account> acctList = securityDecision.getRecords();
                results.result = JSON.serialize(acctList);
                //results.result = JSON.serialize(securityDecision.getRecords());
                results.modifiedIndexes = String.valueOF(securityDecision.getModifiedIndexes());
                results.removedFields = JSON.serialize(securityDecision.getRemovedFields());




            }
        }
        else if (method == 'create') {
            SObjectAccessDecision securityDecision2 = Security.stripInaccessible(AccessType.CREATABLE,new List<Account>{accountRecord});
            /*if (!securityDecision2.getModifiedIndexes().isEmpty()) {
                throw new AuraHandledException('Error Insufficient access to create account');
            }*/            
            List<Account> acctList = securityDecision2.getRecords();
            insert acctList;
            results.queryExecuted = 'SObjectAccessDecision securityDecision2 = Security.stripInaccessible(AccessType.CREATABLE,new List&lt;Account&gt;{accountRecord})' + '<br/>'+ 'List&lt;Account&gt; acctList = securityDecision.getRecords();<br/> insert acctList;';
            results.result = JSON.serialize(acctList);
            results.modifiedIndexes = String.valueOF(securityDecision2.getModifiedIndexes());
            results.removedFields = JSON.serialize(securityDecision2.getRemovedFields());
               
                   
        }
        system.debug('testerResults ' + results);
        return results;

    }

    /*@AuraEnabled(cacheable=true)
    public static String getAccountPickListValues(String fieldApiName){
        List<SelectOption> pickListValuesList= new List<SelectOption>();
        if(string.isNotBlank(fieldApiName)){
            Map<String, Schema.SObjectField> fieldsMap= OpportunityLineItem.getSobjectType().getDescribe().fields.getMap();
            List<Schema.PicklistEntry> ple = fieldsMap.get(fieldApiName).getDescribe().getPicklistValues();
            for(Schema.PicklistEntry pickListVal : ple){
                pickListValuesList.add(new SelectOption(pickListVal.getValue(),pickListVal.getLabel()));
            }
        }
        return JSON.serialize(pickListValuesList);
    }*/


    public class TesterResults {
        @AuraEnabled
        public String queryExecuted;
        @AuraEnabled
        public String result;
        @AuraEnabled
        public String modifiedIndexes;
        @AuraEnabled
        public String removedFields;


        
    }
}


