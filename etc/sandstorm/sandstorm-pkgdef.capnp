@0xeef286f78b0168e0;
# When cloning the example, you'll want to replace the above file ID with a new
# one generated using the `capnp id` command.

using Spk = import "/sandstorm/package.capnp";
# This imports:
#   $SANDSTORM_HOME/latest/usr/include/sandstorm/package.capnp
# Check out that file to see the full, documented package definition format.

const pkgdef :Spk.PackageDefinition = (
  # The package definition. Note that the spk tool looks specifically for the
  # "pkgdef" constant.

  id = "nfqhx83vvzm80edpgkpax8mhqp176qj2vwg67rgq5e3kjc5r4cyh",
  # The app ID is actually the public key used to sign the app package.
  # All packages with the same ID are versions of the same app.
  #
  # If you are working from the example, you'll need to replace the above
  # public key with one of your own. Use the `spk keygen` command to generate
  # a new one.

  manifest = (
    # This manifest is included in your app package to tell Sandstorm
    # about your app.

    appVersion = 1,  # Increment this for every release.
    
    appTitle = (defaultText = "draw.io"),
    
    appMarketingVersion = (defaultText = "5.0.2.3"),

    actions = [
      # Define your "new document" handlers here.
      ( title = (defaultText = "New draw.io diagram"),
        nounPhrase = (defaultText = "diagram"),
        command = .myCommand
        # The command to run when starting for the first time. (".myCommand"
        # is just a constant defined at the bottom of the file.)
      )
    ],

    continueCommand = .myCommand,
    # This is the command called to start your app back up after it has been
    # shut down for inactivity. Here we're using the same command as for
    # starting a new instance, but you could use different commands for each
    # case.
    
    metadata = (
      icons = (
        appGrid = (png = (dpi1x = embed "client/images/drawlogo128.png")),
        grain = (png = (dpi1x = embed "client/images/drawlogo48.png")),
        market = (png = (dpi1x = embed "client/images/drawlogo256.png")),
      ),

      website = "https://www.draw.io/",
      categories = [office, productivity],

      author = (
        contactEmail = "support@draw.io",
        pgpSignature = embed "client/pgp-signature",
      ),
      pgpKeyring = embed "client/pgp-keyring",

      description = (defaultText = embed "client/description.md"),
      
      shortDescription = (defaultText = embed "client/shortDesc.txt"),

      screenshots = [
        (width = 448, height = 243, png = embed "client/images/drawio448.png")
      ],

      changeLog = (defaultText = embed "client/ChangeLog"),
    )
  ),

  sourceMap = (
    # Here we define where to look for files to copy into your package.
    searchPath = [
      ( packagePath = "server", sourcePath = "server" ),
      # Map server binary at "/server".
      
      ( packagePath = "client", sourcePath = "client" ),
      # Map client directory at "/client".

      ( sourcePath = "empty" )
      # Make sure / is mapped to work around Sandstorm bug (temporary).
    ]
  ),

  alwaysInclude = [ "." ]
  # Always include all mapped files, whether or not they are opened during
  # "spk dev".
);

const myCommand :Spk.Manifest.Command = (
  # Here we define the command used to start up your server.
  argv = ["/server"],
  environ = [
    # Note that this defines the *entire* environment seen by your app.
    (key = "PATH", value = "/usr/local/bin:/usr/bin:/bin")
  ]
);
