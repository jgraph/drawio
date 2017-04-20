- Get the draw.io project from github
- Navigate to `drawio/etc/sandstorm`
- Create a directory named `build`
- [Install vagrant-spk](https://docs.sandstorm.io/en/latest/vagrant-spk/installation/)
- `cd build`
- `vagrant-spk setupvm diy`
- `vagrant-spk vm up`
- `cd ..`
- Invoke `./stage.sh` to stage the build files. gfind is gnu find on OS X.
- Log into the vagrant box `vagrant-spk vm ssh`
- `sudo apt-get install g++`
- [Install latest capnp](https://capnproto.org/install.html)
- In the vm, under `/opt/app/.sandstorm` run `make dev`

To package
- Transfer the correct `sandstorm-keyring` file to `/host-dot-sandstorm`
- Update the `sandstorm-pkgdef.capnp` to the correct version (re-stage prior to packaging)
- In the host under `/opt/app/.sandstorm` `spk pack --keyring=/host-dot-sandstorm/sandstorm-keyring --pkg-def=/opt/app/.sandstorm/sandstorm-pkgdef.capnp:pkgdef /home/vagrant/sandstorm-package.spk && spk verify --details /home/vagrant/sandstorm-package.spk && mv /home/vagrant/sandstorm-package.spk /opt/app/sandstorm-drawio.spk`
- In the host under `/opt/app` `spk publish -k /host-dot-sandstorm/sandstorm-keyring sandstorm-drawio.spk`