# Terraform outputs

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.immo.id
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.immo.name
}

output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.immo.repository_url
}

output "load_balancer_dns" {
  description = "DNS name of the load balancer"
  value       = aws_lb.immo.dns_name
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.immo.endpoint
}

output "redis_endpoint" {
  description = "ElastiCache Redis endpoint"
  value       = aws_elasticache_cluster.immo.cache_nodes[0].address
}

output "security_group_id" {
  description = "Security group ID"
  value       = aws_security_group.immo.id
}
