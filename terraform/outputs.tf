output "ec2_elastic_ip" {
  value = module.aws_vpc.elastic_ip
}

output "cluster_name" {
  value = var.cluster_config.name
}
