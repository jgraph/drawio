import java.util.*;
import java.nio.file.*;
import java.io.*; 

public class ReadAndWriteFordBase { 

    //GLOBAL VARIABLES
    String directory="",separationChar="";
    ArrayList<String> listOfCSVFiles = new ArrayList<String>();


    /**
     * Gets user  input for location and row separator used in csv file, afterwards
     * global vars are assigned correspondingly
     */
    public void getUserInput(){
        System.out.println("Pls enter the exact location of folder with csv files");
        Scanner in = new Scanner(System.in);
        directory = in.nextLine();

        System.out.println("Pls enter how the headers of csv files are separated(f.e. ; or :)");
        in = new Scanner(System.in);
        separationChar = in.nextLine();
    }

    /**
     * Gets list of csv files and stores them sorted ascendingly
     */
    public void getListOfCSVFiles(){
        File folder = new File(directory);
        File[] listOfFiles = folder.listFiles();
        for (int i = 0; i < listOfFiles.length; i++) {
            if (listOfFiles[i].isFile()) {
                if(listOfFiles[i].getName().contains(".csv")){
                    listOfCSVFiles.add(listOfFiles[i].getName());
                }
            }
        }
        Collections.sort(listOfCSVFiles);
    }

    /**
     * Creates content of final script and calls writeToFile() function
     */
    public void createContentOfFinalScript(){
        //LOCAL VARIABLES
        int id=44;
        int id_Parent=4448;
        int x=1;

        String fileNameToWrite="diagram.txt";
        String content="<mxGraphModel dx=\"1422\" dy=\"715\" grid=\"1\" gridSize=\"10\" guides=\"1\" tooltips=\"1\" connect=\"1\" arrows=\"1\" fold=\"1\" page=\"1\" pageScale=\"1\" pageWidth=\"827\" pageHeight=\"1169\" math=\"0\" shadow=\"0\">\n\t<root>\n\t\t<mxCell id=\"WIyWlLk6GJQsqaUBKTNV-0\" />\n\t\t<mxCell id=\"WIyWlLk6GJQsqaUBKTNV-1\" parent=\"WIyWlLk6GJQsqaUBKTNV-0\" />\n";

        for(String fileName:listOfCSVFiles){
            //System.out.println("File " + filename); 
            
            Path path = Paths.get(directory, fileName);

            int y=-4;
            
            String fileNameWithOutDot=fileName.substring(0,fileName.indexOf("."));
            //HEADER Of Table
            try {
                List<String> list = Files.readAllLines(path);
                String[] parts=list.get(0).split(separationChar);
                //Sorts content of CSV files
                Arrays.sort(parts);
                //Script part for table header name construction
                content+="\t\t<mxCell id=\"cAaC0mXPn0CXLaZiaHXA-"+(id_Parent)+"\" value=\""+fileNameWithOutDot+".DBF\" style=\"swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=22;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;align=center;fontSize=14;rounded=0;shadow=0;strokeWidth=1;fillColor=none;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" vertex=\"1\">\n\t\t\t<mxGeometry x=\""+((x*160)+140)+"\" y=\"100\" width=\"160\" height=\""+(parts.length+1)*26+"\" as=\"geometry\" />\n</mxCell>\n";

                //The content of table is generated in below for loop
                for(String part :parts){
                    content+="\t\t<mxCell id=\"cAaC0mXPn0CXLaZiaHXA-"+(id++)+"\" value=\""+part+"\" style=\"text;strokeColor=none;fillColor=none;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fontSize=12;\" parent=\"cAaC0mXPn0CXLaZiaHXA-"+id_Parent+"\" vertex=\"1\">\n\t\t\t<mxGeometry y=\""+(y=y+26)+"\" width=\"160\" height=\"26\" as=\"geometry\" />\n</mxCell>\n";
                }
                //Increment of Local variables
                id_Parent++;
                x++;
            } catch (IOException e) {
                // exception handling
            }
        }

        //Final step of assigning path to write the resulting file
        Path pathToWrite=Paths.get(directory, fileNameToWrite);
        //Final part of script to create draw.io Tables
        content+="</root>\n</mxGraphModel>";

        writeToFile(content,pathToWrite);
        System.out.println("Output is at: "+pathToWrite);
    }


    /**
     * @param content text to be written in the file
     * @param path the final destination where the content will be written
     *
     * The contents of file are written to the file
     */
    public static void writeToFile(String content, Path path){
    try {
        Files.write(path, content.getBytes(), StandardOpenOption.CREATE);
        } 
    catch (IOException e) {
        // exception handling
    }
    }

    public static void main(String[] args) 
    { 
        ReadAndWriteFordBase readAndWriteFordBase=new ReadAndWriteFordBase();
        readAndWriteFordBase.getUserInput();
        readAndWriteFordBase.getListOfCSVFiles();
        readAndWriteFordBase.createContentOfFinalScript();
    }

}