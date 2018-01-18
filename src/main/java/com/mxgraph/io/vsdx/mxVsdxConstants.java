package com.mxgraph.io.vsdx;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * This class contains constants used in the Import of .vdx documents.
 */
public class mxVsdxConstants
{
	public static String ANGLE = "Angle";
	public static String ARC_TO = "ArcTo";
	public static String BACKGROUND = "Background";
	public static String BACK_PAGE = "BackPage";
	public static String BEGIN_ARROW = "BeginArrow";
	public static String BEGIN_ARROW_SIZE = "BeginArrowSize";
	public static String BEGIN_X = "BeginX";
	public static String BEGIN_Y = "BeginY";
	public static String BOTTOM_MARGIN = "BottomMargin";
	public static String BULLET = "Bullet";
	public static String CASE = "Case";
	public static String CHARACTER = "Character";
	public static String COLOR = "Color";
	public static String COLOR_ENTRY = "ColorEntry";
	public static String COLORS = "Colors";
	
	/**
	 * Specifies the color transparency used for characters in a text run.
	 * The value is normalized such that a value of 1 corresponds to 100 percent.
	 * A value of zero specifies that the color is completely opaque;
	 * a value of one specifies that the color is completely transparent.
	 */
	public static String COLOR_TRANS = "ColorTrans";
	public static String CONNECT = "Connect";
	public static String CONNECTS = "Connects";
	public static String CONNECTION = "Connection";
	public static String CONTROL = "Control";
	public static String DELETED = "Del";
	public static String DOCUMENT_SHEET = "DocumentSheet";
	public static String ELLIPSE = "Ellipse";
	public static String ELLIPTICAL_ARC_TO = "EllipticalArcTo";
	public static String END_ARROW = "EndArrow";
	public static String END_ARROW_SIZE = "EndArrowSize";
	public static String END_X = "EndX";
	public static String END_Y = "EndY";
	public static String FACE_NAME = "FaceName";
	public static String FACE_NAMES = "FaceNames";
	public static String FALSE = "0";
	public static String FILL = "Fill";
	public static String FILL_BKGND = "FillBkgnd";
	public static String FILL_BKGND_TRANS = "FillBkgndTrans";
	public static String FILL_FOREGND = "FillForegnd";
	public static String FILL_FOREGND_TRANS = "FillForegndTrans";
	public static String FILL_PATTERN = "FillPattern";
	public static String FILL_STYLE = "FillStyle";
	public static String FILL_GRADIENT_ENABLED = "FillGradientEnabled";
	public static String FLAGS = "Flags";
	public static String FLIP_X = "FlipX";
	public static String FLIP_Y = "FlipY";
	public static String FONT = "Font";
	public static String FONT_NAME = "Name";
	public static String FOREIGN = "Foreign";
	public static String FROM_CELL = "FromCell";
	public static String FROM_SHEET = "FromSheet";
	public static String GEOM = "Geom";
	public static String HEIGHT = "Height";
	public static String HORIZONTAL_ALIGN = "HorzAlign";
	public static String ID = "ID";
	public static String INDENT_FIRST = "IndFirst";
	public static String INDENT_LEFT = "IndLeft";
	public static String INDENT_RIGHT = "IndRight";
	public static String INDEX = "IX";
	public static String LEFT_MARGIN = "LeftMargin";
	public static String LETTER_SPACE = "Letterspace";
	public static String LINE = "Line";
	public static String LINE_COLOR = "LineColor";
	public static String LINE_COLOR_TRANS = "LineColorTrans";
	public static String LINE_PATTERN = "LinePattern";
	public static String LINE_STYLE = "LineStyle";
	public static String LINE_TO = "LineTo";
	public static String LINE_WEIGHT = "LineWeight";
	public static String LOC_PIN_X = "LocPinX";
	public static String LOC_PIN_Y = "LocPinY";
	public static String MASTER = "Master";
	public static String MASTER_SHAPE = "MasterShape";
	public static String MASTERS = "Masters";
	public static String MOVE_TO = "MoveTo";
	public static String NAME = "Name";
	public static String NAME_U = "NameU";
	public static String NO_LINE = "NoLine";
	public static String NURBS_TO = "NURBSTo";
	public static String PAGE = "Page";
	public static String PAGE_HEIGHT = "PageHeight";
	public static String PAGE_WIDTH = "PageWidth";
	public static String PAGES = "Pages";
	public static String PARAGRAPH = "Paragraph";
	public static String PIN_X = "PinX";
	public static String PIN_Y = "PinY";
	public static String POS = "Pos";
	public static String RGB = "RGB";
	public static String RIGHT_MARGIN = "RightMargin";
	public static String ROUNDING = "Rounding";
	public static String RTL_TEXT = "RTLText";
	public static String SIZE = "Size";
	public static String SHAPE = "Shape";
	public static String SHAPES = "Shapes";
	public static String SHAPE_SHDW_SHOW = "ShapeShdwShow";
	public static String SHDW_PATTERN = "ShdwPattern";
	public static String SPACE_AFTER = "SpAfter";
	public static String SPACE_BEFORE = "SpBefore";
	public static String SPACE_LINE = "SpLine";
	public static String STRIKETHRU = "Strikethru";
	public static String STYLE = "Style";
	public static String STYLE_SHEET = "StyleSheet";
	public static String STYLE_SHEETS = "StyleSheets";
	public static String TEXT = "Text";
	public static String TEXT_BKGND = "TextBkgnd";
	public static String TEXT_BLOCK = "TextBlock";
	public static String TEXT_STYLE = "TextStyle";
	public static String TO_PART = "ToPart";
	public static String TO_SHEET = "ToSheet";
	public static String TOP_MARGIN = "TopMargin";
	public static String TRUE = "1";
	public static String TXT_ANGLE = "TxtAngle";
	public static String TXT_HEIGHT = "TxtHeight";
	public static String TXT_LOC_PIN_X = "TxtLocPinX";
	public static String TXT_LOC_PIN_Y = "TxtLocPinY";
	public static String TXT_PIN_X = "TxtPinX";
	public static String TXT_PIN_Y = "TxtPinY";
	public static String TXT_WIDTH = "TxtWidth";
	public static String TYPE = "Type";
	public static String TYPE_GROUP = "Group";
	public static String TYPE_SHAPE = "Shape";
	public static String UNIQUE_ID = "UniqueID";
	public static String VERTICAL_ALIGN = "VerticalAlign";
	public static String WIDTH = "Width";
	public static String X_CON = "XCon";
	public static String X_DYN = "XDyn";
	public static String X = "X";
	public static String Y_CON = "YCon";
	public static String Y_DYN = "YDyn";
	public static String Y = "Y";
	public static String HIDE_TEXT = "HideText";
	
	public static String VSDX_ID = "vsdxID";
	
	public static int CONNECT_TO_PART_WHOLE_SHAPE = 3;
	
	public static final String[] SET_VALUES = new String[] { "a", "b" };
	public static final Set<String> MY_SET = new HashSet<String>(Arrays.asList(SET_VALUES));
}
