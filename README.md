# Demo-Exercise

1. In order to install Prometheus and Grafana, I used helm to install both of them from their specific repositories (prometheus-community/prometheus &  grafana/grafana) and changed some values in the configuration files in order to connect grafana to prometheus and to change prometheus scrape interval.

2. In order for Prometheus and Grafana to be shown with their corresponding dashboards you need to execute for each one on a separate terminal : 

export POD_NAME=$(kubectl get pods --namespace grafana -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=grafana" -o jsonpath="{.items[0].metadata.name}")
kubectl --namespace grafana port-forward $POD_NAME 3000

export POD_NAME=$(kubectl get pods --namespace prometheus -l "app.kubernetes.io/name=prometheus,app.kubernetes.io/instance=prometheus" -o jsonpath="{.items[0].metadata.name}")
kubectl --namespace prometheus port-forward $POD_NAME 9090

3. In order to properly configure Terraform's infrastructure you need to provide a terraform.tfvars file with all the necessary values.

4. In order to successfully build the image you need to be on the directory K8s-NodeJS-App/Docker-Image and execute docker build -t spyrous/node_db_app:final . If you use minikube you will need to execute:
 eval $(minikube docker-env) in order for minikube to retrieve the local docker file.


