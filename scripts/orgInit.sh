
#!/bin/bash


sfdx force:org:create -a apexSecurity -f ../config/project-scratch-def.json -d 2 -w 10 -s
sfdx force:source:push -u apexSecurity
sfdx force:user:permset:assign -u apexSecurity -n Apex_Security_Enhancement
sfdx force:org:open -u apexSecurity

