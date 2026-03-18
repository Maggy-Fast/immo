# Terraform pour l'infrastructure AWS IMMO

provider "aws" {
  region = var.aws_region
}

# VPC
resource "aws_vpc" "immo" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "immo-vpc"
  }
}

# Subnets
resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.immo.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "immo-public-subnet-1"
  }
}

resource "aws_subnet" "public_2" {
  vpc_id                  = aws_vpc.immo.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = {
    Name = "immo-public-subnet-2"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "immo" {
  vpc_id = aws_vpc.immo.id

  tags = {
    Name = "immo-igw"
  }
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.immo.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.immo.id
  }

  tags = {
    Name = "immo-public-rt"
  }
}

resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.public.id
}

# Security Group
resource "aws_security_group" "immo" {
  name        = "immo-sg"
  description = "Security group for IMMO application"
  vpc_id      = aws_vpc.immo.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "immo-sg"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "immo" {
  name = "immo-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "immo-cluster"
  }
}

# ECR Repository
resource "aws_ecr_repository" "immo" {
  name = "immo-backend"

  tags = {
    Name = "immo-ecr"
  }
}

# Application Load Balancer
resource "aws_lb" "immo" {
  name               = "immo-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.immo.id]
  subnets            = [aws_subnet.public_1.id, aws_subnet.public_2.id]

  enable_deletion_protection = false

  tags = {
    Name = "immo-alb"
  }
}

# Target Group
resource "aws_lb_target_group" "immo" {
  name     = "immo-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.immo.id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval           = 30
    matcher            = "200"
    path              = "/health"
    port              = "traffic-port"
    protocol          = "HTTP"
    timeout            = 5
    unhealthy_threshold = 2
  }

  tags = {
    Name = "immo-target-group"
  }
}

# Listener
resource "aws_lb_listener" "immo" {
  load_balancer_arn = aws_lb.immo.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.immo.arn
  }
}

# RDS PostgreSQL
resource "aws_db_subnet_group" "immo" {
  name       = "immo-db-subnet-group"
  subnet_ids = [aws_subnet.public_1.id, aws_subnet.public_2.id]

  tags = {
    Name = "immo-db-subnet-group"
  }
}

resource "aws_db_instance" "immo" {
  identifier     = "immo-db"
  engine         = "postgres"
  engine_version = "15.3"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type         = "gp2"
  storage_encrypted    = true

  db_name  = "immo_production"
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.immo.id]
  db_subnet_group_name   = aws_db_subnet_group.immo.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  skip_final_snapshot = false
  final_snapshot_identifier = "immo-db-final-snapshot"

  tags = {
    Name = "immo-rds"
  }
}

# ElastiCache Redis
resource "aws_elasticache_subnet_group" "immo" {
  name       = "immo-cache-subnet"
  subnet_ids = [aws_subnet.public_1.id, aws_subnet.public_2.id]
}

resource "aws_elasticache_cluster" "immo" {
  cluster_id           = "immo-redis"
  engine              = "redis"
  node_type           = "cache.t3.micro"
  num_cache_nodes     = 1
  parameter_group_name = "default.redis7"
  port                = 6379
  subnet_group_name    = aws_elasticache_subnet_group.immo.name
  security_group_ids  = [aws_security_group.immo.id]

  tags = {
    Name = "immo-redis"
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "immo" {
  name              = "/ecs/immo-backend"
  retention_in_days = 14

  tags = {
    Name = "immo-logs"
  }
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "immo_user"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}
