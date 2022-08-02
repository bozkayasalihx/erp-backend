terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.18.0"
    }
  }

  backend "s3" {
    bucket = "bozkayasalihterraform"
    key    = "bozkayasalihterraform/state.tfstate"
    region = "eu-central-1"
  }
}


provider "aws" {
  region = var.networking.region
}
