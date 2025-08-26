resource "kubernetes_deployment" "app" {
metadata {
name = var.app_name
namespace = var.namespace
labels = { app = var.app_name }
}


spec {
replicas = var.replicas


selector { match_labels = { app = var.app_name } }


template {
metadata { labels = { app = var.app_name } }
spec {
container {
name = var.app_name
image = var.image


port { container_port = 8080 }


# ✅ Health checks ensure traffic only routes to ready pods
readiness_probe {
http_get {
path = "/health"
port = 8080
}
initial_delay_seconds = 3
period_seconds = 5
}
liveness_probe {
http_get {
path = "/health"
port = 8080
}
initial_delay_seconds = 10
period_seconds = 10
}
resources {
requests = { cpu = "100m", memory = "128Mi" }
limits = { cpu = "500m", memory = "256Mi" }
}
}
}
}


# ✅ Zero downtime rolling updates
strategy {
type = "RollingUpdate"
rolling_update {
max_surge = "25%"
max_unavailable = 0
}
}
}
}


resource "kubernetes_service" "svc" {
metadata {
name = "${var.app_name}-svc"
namespace = var.namespace
labels = { app = var.app_name }
}


spec {
selector = { app = var.app_name }
port {
port = 80
target_port = 8080
}
type = var.service_type
}
}