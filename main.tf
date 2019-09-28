
terraform {
	backend "s3" {
		bucket = "mono-terraform"
		key = "sr/tf.state"
		region = "us-west-1"
	}
}

provider "aws" {
	profile = "default"
	region = "${var.aws_region}"
}

resource "aws_vpc" "sr" {
  cidr_block = "10.5.0.0/16"
}

resource "aws_subnet" "main" {
  vpc_id     = "${aws_vpc.sr.id}"
  cidr_block = "10.5.1.0/24"

  tags = {
    Name = "Web"
  }
}

resource "aws_internet_gateway" "sr" {
  vpc_id = "${aws_vpc.sr.id}"
}

# Grant the VPC internet access on its main route table
resource "aws_route" "internet_access" {
  route_table_id         = "${aws_vpc.sr.main_route_table_id}"
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = "${aws_internet_gateway.sr.id}"
}

resource "aws_security_group" "sr" {
    name = "sr"
    description = "Allows all traffic"
    vpc_id = "${aws_vpc.sr.id}"

  # HTTP access from the VPC
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH access from anywhere
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # outbound internet access
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_cluster" "sr" {
    name = "sr"
}

resource "aws_ecs_task_definition" "sr" {
  family = "sr"
  network_mode = "host"

  requires_compatibilities = ["EC2"]
# TODO use a variable instead of latest

  container_definitions = <<DEFINITION
[

  {
    "image": "registry.gitlab.com/monofuel34089/system-redemption/sr_main:latest",
    "cpu": 256,
    "portMappings": [
            {
                "containerPort": 3000,
                "hostPort": 3000,
                "protocol": "tcp"
            }
        ],
    "essential": true,
    "memory": 512,
    "name": "sr"
  }
]
DEFINITION
}

data "aws_iam_policy_document" "instance_policy" {
  statement {
    sid = "CloudwatchPutMetricData"

    actions = [
      "cloudwatch:PutMetricData",
    ]

    resources = [
      "*",
    ]
  }

  statement {
    sid = "InstanceLogging"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogStreams",
    ]

    resources = [
      "${aws_cloudwatch_log_group.instance.arn}",
    ]
  }
}

resource "aws_iam_policy" "instance_policy" {
  name   = "${var.name}-ecs-instance"
  path   = "/"
  policy = "${data.aws_iam_policy_document.instance_policy.json}"
}

resource "aws_iam_role" "instance" {
  name = "${var.name}-instance-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "ecs_policy" {
  role       = "${aws_iam_role.instance.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_role_policy_attachment" "instance_policy" {
  role       = "${aws_iam_role.instance.name}"
  policy_arn = "${aws_iam_policy.instance_policy.arn}"
}

resource "aws_iam_instance_profile" "instance" {
  name = "${var.name}-instance-profile"
  role = "${aws_iam_role.instance.name}"
}

resource "aws_ecs_service" "sr" {
  name          = "sr"
  cluster       = "${aws_ecs_cluster.sr.id}"
  desired_count = 1
  launch_type = "EC2"

  task_definition = "${aws_ecs_task_definition.sr.arn}"

}

data "template_file" "user_data" {
  template = "${file("${path.module}/user_data.sh")}"

  vars = {
    ecs_cluster                 = "${aws_ecs_cluster.sr.id}"
    log_group                   = "${aws_cloudwatch_log_group.instance.name}"
  }
}

resource "aws_cloudwatch_log_group" "instance" {
  name = "${var.instance_log_group != "" ? var.instance_log_group : format("%s-instance", var.name)}"
  tags = "${merge(var.tags, map("Name", format("%s", var.name)))}"
}

resource "aws_instance" "leader" {
  ami           = "ami-00ade003160e0a784"
  instance_type = "t2.small"
  key_name = "sr_key"

  vpc_security_group_ids = ["${aws_security_group.sr.id}"]
  subnet_id = "${aws_subnet.main.id}"
  iam_instance_profile = "${aws_iam_instance_profile.instance.name}"

  user_data            = "${data.template_file.user_data.rendered}"


}

resource "aws_eip" "sr-ip" {
  instance = "${aws_instance.leader.id}"
  vpc      = true
}

resource "aws_key_pair" "sr" {
	key_name = "sr_key"
  public_key = "${var.public_key}"
}

resource "linode_domain" "monofuel-dev" {
  domain    = "monofuel.dev"
  type      = "master"
  soa_email = "admin@japura.net"
}

resource "linode_domain_record" "sr" {
  domain_id   = "${linode_domain.monofuel-dev.id}"
  name        = "sr"
  record_type = "A"
  target      = "${aws_instance.leader.public_ip}"
  ttl_sec     = 3600
}
