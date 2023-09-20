# Demo-Exercise

1. In order to install Prometheus and Grafana, I used helm to install both of them from their specific repositories ( ) and changed some values in the configuration files.

2. In order for Prometheus and Grafana to be shown with their corresponding dashboards you need to execute for each one on a separate terminal : 

export POD_NAME=$(kubectl get pods --namespace grafana -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=grafana" -o jsonpath="{.items[0].metadata.name}")
kubectl --namespace grafana port-forward $POD_NAME 3000

export POD_NAME=$(kubectl get pods --namespace prometheus -l "app.kubernetes.io/name=prometheus,app.kubernetes.io/instance=prometheus" -o jsonpath="{.items[0].metadata.name}")
kubectl --namespace prometheus port-forward $POD_NAME 9090