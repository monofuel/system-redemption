# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.define "sr" do |box|

    box.vm.synced_folder ".", "/vagrant", type: "rsync", rsync__exclude: [".git/", ".rts-assets"]
    box.vm.hostname = "system-redemption"
    box.ssh.username = 'monofuel'

    box.vm.provider :linode do |provider, override|
      override.ssh.private_key_path = File.exists?('./id_rsa') ? './id_rsa': '~ansible/.ssh/id_rsa'  

      override.vm.box = 'system-redemption'
      override.vm.box_url = "https://github.com/displague/vagrant-linode/raw/master/box/linode.box"
      override.nfs.functional = false

      provider.api_key = ENV['VAGRANT_LINODE_KEY']
      provider.distribution = 'Debian 9'
      provider.datacenter = 'fremont'
      provider.plan = '1'

      provider.label = 'system-redemption'
    end

    box.vm.provision :ansible do |ansible|
      ansible.playbook = "playbook.yml"
    end

    box.vm.provision "up", type: "shell", run: "always", privileged: false, inline: <<-SHELL
      cd /vagrant
      docker-compose up -d
    SHELL
  end
end
