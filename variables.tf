variable "aws_region" {
  description = "AWS region to launch servers."
  default     = "us-west-1"
}

variable "linode_token" {
  description = "linode.com API token"
}

variable "instance_log_group" {
  description = "Instance log group in CloudWatch Logs"
  default     = ""
}

variable "name" {
  description = "Base name to use for resources in the module"
  default = "sr"
}

variable "tags" {
  description = "A map of tags to add to all resources"
  default     = {}
}


variable "sr_main_sha" {
  description = "CI_COMMIT_SHA for sr_main image"
  default     = "latest"
}


variable "public_key" {
    description = "public ssh key for instances"
    default = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCu4si6/RT8kczzQPuuqmsBgfvHYFIyo42W5AZVpTv5rGfhwrKj5uO3Hn0nUhcHOmCE5oe3hGTv0xL85ufkbUul4hcrtQgXOuFrZWcXQx5iqUsO0UDHvSH0XLPsRR7JHfwG+XVB8JqqMacIpC3KWEOZiUA8D2CFm6Q0GyHK07DDf98phAbDGRc4SpWYpWIdFov0X/RjUiM7uZZBzH3vizm8/PJVh753i6RpueHUkK1iXPb+6TmXKHpFUE8SDqx37CfXoVI6xwf47uooqJPlVAm4L/JqDScwMZkfX741LHre5UzZUoGZKnZ8C6TmhCMisXpNQrSjjDgCgxL4pA4vaBzR pi@raspberrypi"
}
