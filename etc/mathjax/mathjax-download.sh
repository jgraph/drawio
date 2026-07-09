#!/bin/bash

# MathJax Update Script
# Updates MathJax files and fonts to the latest version

set -e  # Exit on error

# Configuration
# Update the mathjax version in etc/dependencies/package.json before running this script
PACKAGE_JSON="$(pwd)/../dependencies/package.json"
MATHJAX_VERSION=$(sed -n 's/.*"mathjax": *"\([^"]*\)".*/\1/p' "$PACKAGE_JSON")

if [ -z "$MATHJAX_VERSION" ]; then
    echo "Failed to read mathjax version from $PACKAGE_JSON" >&2
    exit 1
fi

CDN_BASE="https://cdn.jsdelivr.net/npm/mathjax@${MATHJAX_VERSION}"
FONT_BASE="https://cdn.jsdelivr.net/npm/@mathjax"
TARGET_DIR="$(pwd)/../../src/main/webapp/math4/es5"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}MathJax Update Script${NC}"
echo "Target directory: $TARGET_DIR"
echo "MathJax version: $MATHJAX_VERSION"
echo ""

# Function to download file
download_file() {
    local url="$1"
    local output="$2"
    
    # Create directory if it doesn't exist
    mkdir -p "$(dirname "$output")"
    
    echo "Downloading: $url"
    if curl -fsSL "$url" -o "$output"; then
        echo -e "${GREEN}✓${NC} Downloaded: $output"
        return 0
    else
        echo -e "${RED}✗${NC} Failed: $output"
        return 1
    fi
}

# Core files
echo -e "\n${YELLOW}Updating core files...${NC}"
download_file "$CDN_BASE/core.js" "$TARGET_DIR/core.js"
download_file "$CDN_BASE/startup.js" "$TARGET_DIR/startup.js"

# UI files
echo -e "\n${YELLOW}Updating UI files...${NC}"
download_file "$CDN_BASE/ui/safe.js" "$TARGET_DIR/ui/safe.js"

# Input files
echo -e "\n${YELLOW}Updating input files...${NC}"
download_file "$CDN_BASE/input/tex.js" "$TARGET_DIR/input/tex.js"
download_file "$CDN_BASE/input/asciimath.js" "$TARGET_DIR/input/asciimath.js"

# TeX extensions
echo -e "\n${YELLOW}Updating TeX extensions...${NC}"
TEX_EXTENSIONS=(
    "action" "amscd" "bbm" "bboldx" "bbox" "begingroup" "boldsymbol"
    "braket" "bussproofs" "cancel" "cases" "centernot" "color" "colortbl"
    "dsfont" "empheq" "enclose" "extpfeil" "gensymb" "html" "mathtools"
    "mhchem" "physics" "textcomp" "unicode" "units" "upgreek" "verb"
)

for ext in "${TEX_EXTENSIONS[@]}"; do
    download_file "$CDN_BASE/input/tex/extensions/${ext}.js" \
                  "$TARGET_DIR/input/tex/extensions/${ext}.js"
done

# Output files
echo -e "\n${YELLOW}Updating output files...${NC}"
download_file "$CDN_BASE/output/chtml.js" "$TARGET_DIR/output/chtml.js"
download_file "$CDN_BASE/output/svg.js" "$TARGET_DIR/output/svg.js"

# Font packages
echo -e "\n${YELLOW}Updating fonts...${NC}"

# TeX fonts
echo "Updating mathjax-tex-font..."
download_file "$FONT_BASE/mathjax-tex-font@${MATHJAX_VERSION}/svg.js" \
              "$TARGET_DIR/fonts/mathjax-tex-font/svg.js"
download_file "$FONT_BASE/mathjax-tex-font@${MATHJAX_VERSION}/chtml.js" \
              "$TARGET_DIR/fonts/mathjax-tex-font/chtml.js"

TEX_FONT_FILES=(
    "mjx-tex-b" "mjx-tex-bi" "mjx-tex-brk" "mjx-tex-c" "mjx-tex-cb"
    "mjx-tex-f" "mjx-tex-fb" "mjx-tex-i" "mjx-tex-lo" "mjx-tex-m"
    "mjx-tex-mi" "mjx-tex-n" "mjx-tex-ob" "mjx-tex-os" "mjx-tex-s3"
    "mjx-tex-s4" "mjx-tex-ss" "mjx-tex-ssb" "mjx-tex-ssi" "mjx-tex-so"
    "mjx-tex-v" "mjx-tex-zero"
)

for font in "${TEX_FONT_FILES[@]}"; do
    download_file "$FONT_BASE/mathjax-tex-font@${MATHJAX_VERSION}/chtml/woff2/${font}.woff2" \
                  "$TARGET_DIR/fonts/mathjax-tex-font/chtml/woff2/${font}.woff2"
done

# BBM font extension
echo "Updating mathjax-bbm-font-extension..."
download_file "$FONT_BASE/mathjax-bbm-font-extension@${MATHJAX_VERSION}/svg.js" \
              "$TARGET_DIR/fonts/mathjax-bbm-font-extension/svg.js"
download_file "$FONT_BASE/mathjax-bbm-font-extension@${MATHJAX_VERSION}/chtml.js" \
              "$TARGET_DIR/fonts/mathjax-bbm-font-extension/chtml.js"

BBM_FONT_FILES=("mjx-mb-bb" "mjx-mb-bm" "mjx-mb-bn" "mjx-mb-bss" "mjx-mb-bssb")
for font in "${BBM_FONT_FILES[@]}"; do
    download_file "$FONT_BASE/mathjax-bbm-font-extension@${MATHJAX_VERSION}/chtml/woff2/${font}.woff2" \
                  "$TARGET_DIR/fonts/mathjax-bbm-font-extension/chtml/woff2/${font}.woff2"
done

# BBoldX font extension
echo "Updating mathjax-bboldx-font-extension..."
download_file "$FONT_BASE/mathjax-bboldx-font-extension@${MATHJAX_VERSION}/svg.js" \
              "$TARGET_DIR/fonts/mathjax-bboldx-font-extension/svg.js"
download_file "$FONT_BASE/mathjax-bboldx-font-extension@${MATHJAX_VERSION}/chtml.js" \
              "$TARGET_DIR/fonts/mathjax-bboldx-font-extension/chtml.js"

BBOLDX_FONT_FILES=("mjx-mb-bb" "mjx-mb-bbb" "mjx-mb-blb")
for font in "${BBOLDX_FONT_FILES[@]}"; do
    download_file "$FONT_BASE/mathjax-bboldx-font-extension@${MATHJAX_VERSION}/chtml/woff2/${font}.woff2" \
                  "$TARGET_DIR/fonts/mathjax-bboldx-font-extension/chtml/woff2/${font}.woff2"
done

# DSFont font extension
echo "Updating mathjax-dsfont-font-extension..."
download_file "$FONT_BASE/mathjax-dsfont-font-extension@${MATHJAX_VERSION}/svg.js" \
              "$TARGET_DIR/fonts/mathjax-dsfont-font-extension/svg.js"
download_file "$FONT_BASE/mathjax-dsfont-font-extension@${MATHJAX_VERSION}/chtml.js" \
              "$TARGET_DIR/fonts/mathjax-dsfont-font-extension/chtml.js"

DSFONT_FONT_FILES=("mjx-md-dr" "mjx-md-ds")
for font in "${DSFONT_FONT_FILES[@]}"; do
    download_file "$FONT_BASE/mathjax-dsfont-font-extension@${MATHJAX_VERSION}/chtml/woff2/${font}.woff2" \
                  "$TARGET_DIR/fonts/mathjax-dsfont-font-extension/chtml/woff2/${font}.woff2"
done

# MHChem font extension
echo "Updating mathjax-mhchem-font-extension..."
download_file "$FONT_BASE/mathjax-mhchem-font-extension@${MATHJAX_VERSION}/svg.js" \
              "$TARGET_DIR/fonts/mathjax-mhchem-font-extension/svg.js"
download_file "$FONT_BASE/mathjax-mhchem-font-extension@${MATHJAX_VERSION}/chtml.js" \
              "$TARGET_DIR/fonts/mathjax-mhchem-font-extension/chtml.js"

MHCHEM_FONT_FILES=("mjx-mhc-m")
for font in "${MHCHEM_FONT_FILES[@]}"; do
    download_file "$FONT_BASE/mathjax-mhchem-font-extension@${MATHJAX_VERSION}/chtml/woff2/${font}.woff2" \
                  "$TARGET_DIR/fonts/mathjax-mhchem-font-extension/chtml/woff2/${font}.woff2"
done

echo -e "\n${GREEN}Update complete!${NC}"
