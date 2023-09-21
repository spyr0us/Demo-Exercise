# Demo-Exercise

1. In order to install Prometheus and Grafana, I used helm to install both of them from their specific repositories (prometheus-community/prometheus &  grafana/grafana) and changed some values in the configuration files in order to connect grafana to prometheus and to change prometheus scrape interval.

2. In order for Prometheus and Grafana to be shown with their corresponding dashboards you need to execute for each one on a separate terminal : 

export POD_NAME=$(kubectl get pods --namespace grafana -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=grafana" -o jsonpath="{.items[0].metadata.name}")\
kubectl --namespace grafana port-forward $POD_NAME 3000

export POD_NAME=$(kubectl get pods --namespace prometheus -l "app.kubernetes.io/name=prometheus,app.kubernetes.io/instance=prometheus" -o jsonpath="{.items[0].metadata.name}")\
kubectl --namespace prometheus port-forward $POD_NAME 9090

3. In order to properly configure Terraform's infrastructure you need to do the following steps:\
    a) Create an account at Mongodb-Atlas and generate an API key (with "Organization Owner" Permissions) to authenticate the Terraform MongoDB Atlas Provider.\
    b) Add API Key Access List entry (Preferably use your own ip and save).\
    c) Configure the MongoDB Atlas Provider using the MongoDB Atlas API Key you generated and create Environment Variables with the below commands:\
        $ export MONGODB_ATLAS_PUBLIC_KEY="<insert your public key here>"\
        $ export MONGODB_ATLAS_PRIVATE_KEY="<insert your private key here>"\
    d) Provide a terraform.tfvars file with all the necessary values.\
    e) The database user_password is a sensitive secret, so to access it, you will need to input the “terraform output -json user_password” command in your terminal window after our deployment is complete to reveal. 

4. In order to successfully build the image you need to be on the directory K8s-NodeJS-App/Docker-Image and execute:\
   docker build -t spyrous/node_db_app:final .\
   !! If you use minikube you will need to execute: eval $(minikube docker-env) first in order for minikube to be able to retrieve the local docker file. !!

   !! If you use minikube you will need to execute: eval $(minikube docker-env) first in order for minikube to be able to retrieve the local docker file. !! 
