output "namespace" { value = var.namespace }
output "service_name" { value = kubernetes_service.svc.metadata[0].name }
output "service_type" { value = kubernetes_service.svc.spec[0].type }