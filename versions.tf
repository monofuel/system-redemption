terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
    linode = {
      source = "linode/linode"
    }
    template = {
      source = "hashicorp/template"
    }
  }
  required_version = ">= 0.13"
}
