@0xeef286f78b0168e0;
# When cloning the example, you'll want to replace the above file ID with a new
# one generated using the `capnp id` command.

using Spk = import "/sandstorm/package.capnp";
using Grain = import "/sandstorm/grain.capnp";

# This imports:
#   $SANDSTORM_HOME/latest/usr/include/sandstorm/package.capnp
# Check out that file to see the full, documented package definition format.

const pkgdef :Spk.PackageDefinition = (
  # The package definition. Note that the spk tool looks specifically for the
  # "pkgdef" constant.

  id = "a3w50h1435gsxczugm16q0amwkqm9f4crykzea53sv61pt7phk8h",
  # The app ID is actually the public key used to sign the app package.
  # All packages with the same ID are versions of the same app.
  #
  # If you are working from the example, you'll need to replace the above
  # public key with one of your own. Use the `spk keygen` command to generate
  # a new one.

  manifest = (
    # This manifest is included in your app package to tell Sandstorm
    # about your app.

    appVersion = 3,  # Increment this for every release.
    
    appTitle = (defaultText = "draw.io"),
    
    appMarketingVersion = (defaultText = "6.5.4"),

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
      codeUrl = "https://github.com/jgraph/draw.io",
      license = (openSource = gpl3),
      categories = [office, productivity],

      author = (
        upstreamAuthor = "JGraph",
        contactEmail = "support@draw.io",
        pgpSignature = embed "pgp-signature",
      ),
      pgpKeyring = embed "pgp-keyring",

      description = (defaultText = embed "description.md"),
      
      shortDescription = (defaultText = embed "shortDesc.txt"),

      screenshots = [
        (width = 448, height = 243, png = embed "client/images/drawio448.png")
      ],

      changeLog = (defaultText = embed "ChangeLog"),
    )
  ),

  sourceMap = (
    # Here we define where to look for files to copy into your package.
    searchPath = [
      ( packagePath = "server", sourcePath = "server" ),
      # Map server binary at "/server".
      
      ( packagePath = "client", sourcePath = "client" ),
      # Map client directory at "/client".
    ]
  ),

  alwaysInclude = [ "." ]
  # Always include all mapped files, whether or not they are opened during
  # "spk dev".
);

const appIndexViewInfo :Grain.UiView.ViewInfo = (
  permissions = [(name = "write", title = (defaultText = "write"),
                  description = (defaultText = "allows editing diagrams")),
                 (name = "read", title = (defaultText = "read"),
                  description = (defaultText = "allows viewing diagrams"))],
  roles = [(title = (defaultText = "editor"),
            permissions = [true, true],
            verbPhrase = (defaultText = "can edit"),
            default = true),
           (title = (defaultText = "viewer"),
            permissions = [false, true],
            verbPhrase = (defaultText = "can view"))]
);

const myCommand :Spk.Manifest.Command = (
  # Here we define the command used to start up your server.
  argv = ["/server"],
  environ = [
    # Note that this defines the *entire* environment seen by your app.
    (key = "PATH", value = "/usr/local/bin:/usr/bin:/bin")
  ]
);
