variable "namespace" {
type = string
default = "demo"
description = "Kubernetes namespace to deploy into"
}


variable "app_name" {
type = string
default = "ai-demo"
}


variable "image" {
type = string
description = "Container image (e.g., docker.io/<user>/ai-demo:TAG)"
}


variable "replicas" {
type = number
default = 2
}


variable "service_type" {
type = string
default = "LoadBalancer" # ClusterIP | NodePort | LoadBalancer
}


variable "kubeconfig_path" {
type = string
default = "~/.kube/config"
}