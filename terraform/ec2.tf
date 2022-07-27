resource "aws_instance" "demo-server" {
  ami           = data.aws_ami.demo-server-ami.id
  instance_type = var.instance_type

  availability_zone = var.avail_zone

  vpc_security_group_ids = [aws_security_group.demo-server-sg.id]
  subnet_id              = aws_subnet.demo-server-subnet-1.id

  associate_public_ip_address = true
  key_name                    = aws_key_pair.deployer.key_name

  tags = {
    Name = "demo-server"
  }
}

