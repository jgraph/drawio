To build:

1) Setup environment for building as described in https://github.com/sandstorm-io/sandstorm-rawapi-example.
	You don't need clang, you have to use g++ instead. Build CnP from github, but Sandstorm stable is fine.
2) Follow any necessary steps from the draw.io main build README required to ensure the build is stable
3) Create a ChangeLog entry with a version number and a timestamp
4) Commit all changes and tag both the drawio and mxgraph2 modules using drawiosandstorm-m_n_r_b
5) Execute build.sh in this directory to the package
6) In the build directory invoke 'spk publish package.spk' to submit for publishing