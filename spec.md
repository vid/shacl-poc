POC - Data Entry Form using SHACL

The exercise is to deliver a docker compose file 
that will run a node.js app 
along with a free GraphDB database.  
The app should present an html data entry form 
for a user to manually enter the name, description, url, start date, and location of a fictional event. 
Other fields can be displayed as a bonus. 
The app needs to use the SHACL file included below 
in order to display the form (name and order of fields), 
validate the form (check for mandatory fields etc.). 
If the form data passes the validation 
the data should be stored in the GraphDB database.  
If the form data does not pass validation, 
the errors and warnings should displayed in the form next to each field.

Here is a link to a Docker image of the free graphDB product to use as the graph database: https://hub.docker.com/r/khaller/graphdb-free

Here is the SHACL file:
https://semantify.it/list/wS4r3c9hQ?ds=mhpmBCJJt&format=shacl

