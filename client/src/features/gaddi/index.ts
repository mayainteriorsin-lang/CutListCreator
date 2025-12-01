/**
 * GADDI Dotted Line System - Simple & Clean
 * 
 * Rule:
 * - LEFT/RIGHT panels: Mark HEIGHT (nomH) - dotted line follows HEIGHT wherever it is
 * - TOP/BOTTOM panels: Mark WIDTH (nomW) - dotted line follows WIDTH wherever it is
 * - Even if panel rotates on sheet, dotted line always marks the same dimension
 */

export interface GaddiPanel {
  panelType: string;
  gaddi: boolean;
  nomW: number;  // Original width
  nomH: number;  // Original height
  w: number;     // Sheet placement width
  h: number;     // Sheet placement height
}

export interface GaddiLineConfig {
  markDimension: 'width' | 'height';
  sheetAxis: 'x' | 'y';
  inset: number;
  dashPattern: number[];
  lineWidth: number;
  color: number;
}

/**
 * Should GADDI marking be shown?
 */
export function shouldShowGaddiMarking(panel: GaddiPanel): boolean {
  return panel.gaddi === true && panel.w > 15 && panel.h > 15;
}

/**
 * Calculate which dimension GADDI marks and which axis to draw on
 * 
 * RULES:
 * Sheet: X-axis=1210mm (horizontal), Y-axis=2420mm (vertical)
 * 
 * - LEFT/RIGHT: Always mark HEIGHT (nomH)
 *   * If nomH ≈ w on sheet → line on X-axis (horizontal)
 *   * If nomH ≈ h on sheet → line on Y-axis (vertical)
 * 
 * - TOP/BOTTOM: Always mark WIDTH (nomW)
 *   * If nomW ≈ w on sheet → line on X-axis (horizontal)
 *   * If nomW ≈ h on sheet → line on Y-axis (vertical)
 */
export function calculateGaddiLineDirection(panel: GaddiPanel): GaddiLineConfig {
  const { panelType, nomW, nomH, w, h } = panel;
  const type = (panelType || '').toUpperCase();
  
  let markDimension: 'width' | 'height';
  let sheetAxis: 'x' | 'y';
  
  if (type.includes('LEFT') || type.includes('RIGHT')) {
    // LEFT/RIGHT: Always mark HEIGHT (nomH)
    markDimension = 'height';
    // Find which axis nomH appears on
    if (Math.abs(w - nomH) < 0.5) {
      sheetAxis = 'x'; // nomH is on X-axis → horizontal line
    } else {
      sheetAxis = 'y'; // nomH is on Y-axis → vertical line
    }
    
  } else if (type.includes('TOP') || type.includes('BOTTOM')) {
    // TOP/BOTTOM: Always mark WIDTH (nomW)
    markDimension = 'width';
    // Find which axis nomW appears on
    if (Math.abs(w - nomW) < 0.5) {
      sheetAxis = 'x'; // nomW is on X-axis → horizontal line
    } else {
      sheetAxis = 'y'; // nomW is on Y-axis → vertical line
    }
    
  } else {
    // Default: mark HEIGHT on Y-axis
    markDimension = 'height';
    sheetAxis = 'y';
  }
  
  return {
    markDimension,
    sheetAxis,
    inset: 2,              // 2mm from edge
    dashPattern: [2, 2],   // 2mm dash, 2mm gap
    lineWidth: 0.5,        // 0.5mm line width
    color: 100             // Gray
  };
}
