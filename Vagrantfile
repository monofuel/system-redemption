# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.define "sr" do |box|

    box.vm.hostname = "system-redemption"
    box.ssh.username = 'monofuel'

    box.vm.provider :linode do |provider, override|
      override.ssh.private_key_path = '~ansible/.ssh/id_rsa'

      override.vm.box = 'system-redemption'
      override.vm.box_url = "https://github.com/displague/vagrant-linode/raw/master/box/linode.box"
      override.nfs.functional = false

      provider.api_key = ENV['VAGRANT_LINODE_KEY']
      provider.distribution = 'Debian 9'
      provider.datacenter = 'fremont'
      provider.plan = 'Linode 1G'

      provider.label = 'system-redemption'
    end

    box.vm.provision :ansible do |ansible|
      ansible.playbook = "playbook.yml"
    end
  end
end
