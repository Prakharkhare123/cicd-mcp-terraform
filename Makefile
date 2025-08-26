APP_NAME=ai-demo
IMAGE?=docker.io/$(USER)/$(APP_NAME):dev


build:
docker build -t $(IMAGE) ./app


push:
docker push $(IMAGE)


plan:
cd terraform && terraform init -upgrade && terraform plan -var="image=$(IMAGE)"


apply:
cd terraform && terraform apply -auto-approve -var="image=$(IMAGE)"


rollout:
kubectl rollout status deploy/$(APP_NAME) -n demo


url:
kubectl get svc $(APP_NAME)-svc -n demo -o wide