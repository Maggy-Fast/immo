# Terraform pour frontend S3 + CloudFront

# Bucket S3 pour le frontend
resource "aws_s3_bucket" "frontend" {
  bucket = "immo-frontend-${var.environment}"
  
  tags = {
    Name = "immo-frontend-bucket"
    Environment = var.environment
  }
}

# Configuration du bucket S3
resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  
  index_document {
    suffix = "index.html"
  }
  
  error_document {
    key = "index.html"
  }
}

# Configuration CORS
resource "aws_s3_bucket_cors_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  
  cors_rule {
    allowed_origins = ["*"]
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    max_age_seconds = 3000
  }
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "frontend" {
  enabled = true
  is_ipv6_enabled = true
  
  default_cache_behavior {
    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.frontend.id
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl = 0
    default_ttl = 3600
    max_ttl = 86400
  }
  
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id = aws_s3_bucket.frontend.id
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.frontend.cloudfront_access_identity_path
    }
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }
  
  default_root_object = "index.html"
  
  tags = {
    Name = "immo-frontend-cloudfront"
    Environment = var.environment
  }
}

# Origin Access Identity pour CloudFront
resource "aws_cloudfront_origin_access_identity" "frontend" {
  comment = "OAI for IMMO frontend"
}

# Policy pour permettre à CloudFront d'accéder à S3
data "aws_iam_policy_document" "frontend_s3_policy" {
  statement {
    actions = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.frontend.arn}/*"]
    
    principals {
      type = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.frontend.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  policy = data.aws_iam_policy_document.frontend_s3_policy.json
}
