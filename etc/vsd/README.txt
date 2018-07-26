VsdConverterApp:

C# Console App. It is a local TCP server that receives *.vsd files paths from clients and convert them to *.vsdx files using Visio.

This application is needed to avoid security limitation that prevents this code from running inside IIS directly.  

VsdConverter:

AST.net web application that provides *.vsd files conversion service and acts as a client to the previous TCP server.

========================================
Running the conversion site without Hyper-V:

1- Run VsdConverterApp TCP sever
2- Deploy VsdConverter to IIS manually

2.1- Install IIS and enable ASP.NET
	2.1.a Open Control Panel, Programs and Features, Turn Windows features on or off.
	2.1.b Expand Internet Information Services, World Wide Web Services, and Application Development Features.
	2.1.c Make sure that ASP.NET 4.7 is selected.
2.2- After installing IIS, run IIS Manager to make sure that the .NET Framework version 4 is assigned to the default application pool.
	2.2.a Press WINDOWS+R to open the Run dialog box.
	2.2.b Enter "inetmgr", and then click OK.
	2.2.c In the Connections pane, expand the server node and select Application Pools. In the Application Pools pane, if DefaultAppPool is assigned to the .NET framework version 4, skip to (2.3).
	2.2.d In the Application Pools pane, click DefaultAppPool, and then in the Actions pane click Basic Settings.
	2.2.e In the Edit Application Pool dialog box, change .NET Framework version to .NET Framework v4.0.30319 and click OK.
	2.2.f IIS is now ready for you to publish a web application to it.
2.3- Create the deployment files from Visual Studio (Build-> Publish VsdConverter) and select folder deploy
2.4- Upload the folder (zipped) & the TCP server App (VsdConverterApp) to Google Drive and download it from the server
2.5- Unpack the files to IIS app in C:\VsdConverter && exe to VsdConverterLocalSrv
2.6- In folder: C:\inetpub\wwwroot\VsdConverter_deploy
	2.6.a create folder: App_Data
	2.6.b Open Properties of App_Data -> Security -> Edit
	2.6.c Give full control to Users: IIS_IUSRS
2.7- Website is ready 
========================================
Running the conversion site with Hyper-V:

1- Run VsdConverterApp TCP sever
2- Deploy VsdConverter to IIS (manually or using Web Deployment Tool).

In details (Ignore Hyper-V steps if it is running directly on the server):

Enable Hyper-V in Windows Features

In Hyper-V Manager:

1- Create a new virtual machine and select Windows 10 Dev
	https://medium.com/@pugillum/setting-up-a-windows-server-2012-vm-on-windows-10-hyper-v-a23f854f34eb
2- Install Visio in the VM
	2.a Add Visio .iso file as a DVD
	2.b Install from the DVD inside the VM normally
	[OR] Download and istall Visio online
3- Install IIS and enable ASP.NET
	3.a Open Control Panel, Programs and Features, Turn Windows features on or off.
	3.b Expand Internet Information Services, World Wide Web Services, and Application Development Features.
	3.c Make sure that ASP.NET 4.7 is selected.
4- After installing IIS, run IIS Manager to make sure that the .NET Framework version 4 is assigned to the default application pool.
	4.a Press WINDOWS+R to open the Run dialog box.
	4.b Enter "inetmgr", and then click OK.
	4.c In the Connections pane, expand the server node and select Application Pools. In the Application Pools pane, if DefaultAppPool is assigned to the .NET framework version 4, skip to (5).
	4.d In the Application Pools pane, click DefaultAppPool, and then in the Actions pane click Basic Settings.
	4.e In the Edit Application Pool dialog box, change .NET Framework version to .NET Framework v4.0.30319 and click OK.
	4.f IIS is now ready for you to publish a web application to it.
5- Install Web Deploy https://technet.microsoft.com/en-us/library/dd569059.aspx --> x64 (64–bit) Web Deployment Tool (x64)
	5.a Direct link: http://download.microsoft.com/download/8/9/B/89B754A5-56F7-45BD-B074-8974FD2039AF/WebDeploy_2_10_amd64_en-US.msi
6- Open Control Panel\System and Security\System then Advanced system settings
	6.a Advanced tab -> Environment Variables
	6.b System variables -> Path -> Edit...
	6.c New -> add the following: C:\Program Files\IIS\Microsoft Web Deploy V2
	
7- Open the command prompt (cmd) and change directory to the VsdConverter Package
	7.a Run the deployment command: VsdConverter.deploy.cmd /Y
8- In folder: C:\inetpub\wwwroot\VsdConverter_deploy
	8.a create folder: App_Data
	8.b Open Properties of App_Data -> Security -> Edit
	8.c Give full control to Users: IIS_IUSRS
9- Website is ready inside the VM: http://localhost/VsdConverter_deploy/
	outside the VM by its ip which can be found using ipconfig (step 1)


