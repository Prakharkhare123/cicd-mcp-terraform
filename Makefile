APP_NAME=ai-cicd-app
IMAGE?=pk233/$(APP_NAME):latest
NAMESPACE=default

# 🚀 Build and Deploy
build:
	docker build -t $(IMAGE) ./app

push:
	docker push $(IMAGE)

# 📋 Terraform Operations
plan:
	cd terraform && terraform init -upgrade && terraform plan -var="image=$(IMAGE)" -var="app_name=$(APP_NAME)" -var="namespace=$(NAMESPACE)"

apply:
	cd terraform && terraform apply -auto-approve -var="image=$(IMAGE)" -var="app_name=$(APP_NAME)" -var="namespace=$(NAMESPACE)"

destroy:
	cd terraform && terraform destroy -auto-approve -var="image=$(IMAGE)" -var="app_name=$(APP_NAME)" -var="namespace=$(NAMESPACE)"

# 🔍 Kubernetes Operations
status:
	kubectl get deployments,pods,svc -l app=$(APP_NAME) -n $(NAMESPACE)

logs:
	kubectl logs -l app=$(APP_NAME) -n $(NAMESPACE) --tail=50 -f

scale:
	@read -p "Enter replica count: " replicas; \
	kubectl scale deployment $(APP_NAME) --replicas=$$replicas -n $(NAMESPACE)

rollout:
	kubectl rollout status deploy/$(APP_NAME) -n $(NAMESPACE)

restart:
	kubectl rollout restart deployment/$(APP_NAME) -n $(NAMESPACE)

url:
	kubectl get svc $(APP_NAME)-svc -n $(NAMESPACE) -o wide

# 🤖 MCP Server
mcp-install:
	cd mcp && npm install

mcp-start:
	cd mcp && npm start

# 🧪 Testing
test-health:
	@echo "Testing health endpoint..."
	@kubectl port-forward svc/$(APP_NAME)-svc 8080:80 -n $(NAMESPACE) & \
	sleep 3 && \
	curl -f http://localhost:8080/health && \
	echo "\n✅ Health check passed" || echo "\n❌ Health check failed"

# 📊 Full Pipeline
full-deploy: build push apply status
	@echo "🎉 Full deployment completed!"

help:
	@echo "Available commands:"
	@echo "  build       - Build Docker image"
	@echo "  push        - Push Docker image"
	@echo "  plan        - Terraform plan"
	@echo "  apply       - Terraform apply"
	@echo "  destroy     - Terraform destroy"
	@echo "  status      - Get K8s status"
	@echo "  logs        - View app logs"
	@echo "  scale       - Scale replicas"
	@echo "  rollout     - Check rollout status"
	@echo "  restart     - Restart deployment"
	@echo "  url         - Get service URL"
	@echo "  mcp-install - Install MCP dependencies"
	@echo "  mcp-start   - Start MCP server"
	@echo "  test-health - Test health endpoint"
	@echo "  full-deploy - Complete build+push+deploy"

.PHONY: build push plan apply destroy status logs scale rollout restart url mcp-install mcp-start test-health full-deploy help