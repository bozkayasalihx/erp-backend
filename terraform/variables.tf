variable "vpc_cidr_block" {
  description = "vpc cidr ip block"
  type        = string
}


variable "server_port" {
  description = "port that run port on"
  type        = number
}

variable "public_ssh_file_location" {
  description = "ssh file location"
}

variable "instance_type" {
  description = "ec2 instance type"
  type        = string
}

variable "my_ip" {
  description = "my default ip"
  type        = string
}

variable "subnet_cidr_block" {
  description = "subnet cidr ip block"
  type        = string
}

variable "avail_zone" {
  description = "availability zone of app"
  type        = string
}

variable "env_prefix" {
  type = string
}
