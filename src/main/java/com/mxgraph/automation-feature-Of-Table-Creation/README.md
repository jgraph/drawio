This feature automates the table creation in drawio platform. 

How does it work:
1) there is already java compiled code, thus you can just enter:
java ReadAndWriteFordBase
2) Enter the location of CSV files(you can use sample.csv file inside of Sample folder, which is in the current directory)
3) Enter the row separator of CSV files(if you are using sample.csv, the row separator is ; )
4) The diagram.txt file is generated and the location is shown on Terminal. The target location is the location, which was entered by user in the 2nd step. 
5)Now go to "https://app.diagrams.net/" and close the pop up window. Go to Help -> Edit Diagram and replace the content of that window with the content from the generated diagram.txt from the 4th step