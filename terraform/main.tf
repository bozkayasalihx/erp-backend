terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region     = "eu-central-1"
  access_key = "AKIAQKOSBV7BVE764P6S"
  secret_key = "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"
}




resource "aws_vpc" "demo-server-vpc" {
  cidr_block = var.vpc_cidr_block
  tags = {
    Name = "${var.env_prefix}-vpc"
  }
}


resource "aws_subnet" "demo-server-subnet-1" {
  vpc_id            = aws_vpc.demo-server-vpc.id
  cidr_block        = var.subnet_cidr_block
  availability_zone = var.avail_zone
  tags = {
    Name = "${var.env_prefix}-subnet-1"
  }
}


resource "aws_internet_gateway" "demo-server-gw" {
  vpc_id = aws_vpc.demo-server-vpc.id
  tags = {
    Name = "${var.env_prefix}-demo-server-gw"
  }
}

resource "aws_route_table" "demo-server-route-table" {
  vpc_id = aws_vpc.demo-server-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.demo-server-gw.id
  }
  tags = {
    Name = "${var.env_prefix}-demo-server-rt"
  }
}


resource "aws_route_table_association" "a-rtb" {
  route_table_id = aws_route_table.demo-server-route-table.id
  subnet_id      = aws_subnet.demo-server-subnet-1.id
}


resource "aws_security_group" "demo-server-sg" {
  name   = "demo-server-sg"
  vpc_id = aws_vpc.demo-server-vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.my_ip]
  }

  ingress {
    from_port   = var.server_port
    to_port     = var.server_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
    prefix_list_ids = []
  }

  tags = {
    Name = "${var.env_prefix}-sg"
  }
}

data "aws_ami" "demo-server-ami" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-kernel*-gp2"]
  }
  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }

}

output "aws-ami_id" {
  value = data.aws_ami.demo-server-ami.id
}

resource "aws_key_pair" "deployer" {
  key_name   = "deployer-key"
  public_key = file(var.public_ssh_file_location)
}


output "aws_vpc_id" {
  description = "demo server vpc id"
  value       = aws_vpc.demo-server-vpc.id
}

output "aws_subnet_1_id" {
  description = "aws subnet id"
  value       = aws_subnet.demo-server-subnet-1.id
}
