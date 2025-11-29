/**
 * STANDARD DIMENSIONAL MAPPING
 * This module contains ONLY non-wood grain (standard) logic
 * Never mix with wood grain code
 */

import type { Panel, OptimizerPart } from '../cutlist/core/types';

/**
 * Get panel type order for sorting
 */
function getPanelTypeOrder(name: string): number {
  const n = name.toLowerCase();
  if (/(^|\W)back(\W|$)/.test(n)) return 1;      // BACK panels first (usually smaller)
  if (/(^|\W)left(\W|$)/.test(n)) return 2;      // LEFT panels
  if (/(^|\W)right(\W|$)/.test(n)) return 3;     // RIGHT panels
  if (/(^|\W)top(\W|$)/.test(n)) return 4;       // TOP panels
  if (/(^|\W)bottom(\W|$)/.test(n)) return 5;    // BOTTOM panels
  return 6;                                       // Other panels last
}

/**
 * Sort parts for cleaner, more organized layouts
 */
function sortParts(parts: OptimizerPart[]): void {
  parts.sort((a, b) => {
    // First sort by panel type (grouping similar panels)
    const typeOrderA = getPanelTypeOrder(a.name);
    const typeOrderB = getPanelTypeOrder(b.name);
    if (typeOrderA !== typeOrderB) return typeOrderA - typeOrderB;
    
    // Within same type, sort by area (larger first for better packing)
    const areaA = a.w * a.h;
    const areaB = b.w * b.h;
    return areaB - areaA;
  });
}

/**
 * Prepare parts with STANDARD dimensional mapping
 * When laminate has wood grains enabled, prevent rotation
 * 
 * @param panels - Array of panels from UI
 * @param woodGrainsPreferences - Map of laminate codes with wood grain status
 * @returns Array of parts ready for standard optimization
 */
export function prepareStandardParts(panels: Panel[], woodGrainsPreferences: Record<string, boolean> = {}): OptimizerPart[] {
  const parts: OptimizerPart[] = [];
  
  panels.forEach((p, idx) => {
    // Extract basic properties
    const name = String(p.name ?? p.id ?? `panel-${idx}`);
    const nomW = Number(p.nomW ?? p.width ?? p.w ?? 0);
    const nomH = Number(p.nomH ?? p.height ?? p.h ?? 0);
    const laminateCode = String(p.laminateCode ?? '').trim();
    const frontCode = laminateCode.split('+')[0].trim();
    
    // Check if wood grains are enabled for this laminate
    const woodGrainsEnabled = woodGrainsPreferences[frontCode] === true;
    
    // STANDARD MODE: Use nominal dimensions as-is (no wood grain swapping)
    const w = nomW;
    const h = nomH;
    
    // Mutate original panel with display dimensions
    p.displayW = w;
    p.displayH = h;
    p.nomW = nomW;
    p.nomH = nomH;
    p.grainFlag = false;
    p.woodGrainsEnabled = woodGrainsEnabled;
    
    // Create optimizer part
    const safeId = String(p.id ?? name ?? `part-${idx}`);
    const part: OptimizerPart = {
      id: safeId,
      name,
      nomW,
      nomH,
      w,
      h,
      qty: 1,
      rotate: !woodGrainsEnabled,  // Prevent rotation if wood grains enabled
      gaddi: p.gaddi === true,
      laminateCode,
      grainFlag: false,
      woodGrainsEnabled: woodGrainsEnabled,  // Store for reference
      originalPanel: p
    };
    
    parts.push(part);
  });
  
  // Sort panels for better organization
  sortParts(parts);
  
  // Debug logging
  console.groupCollapsed('📦 prepareStandardParts — summary');
  console.log(`Standard Mode: ON (No Wood Grains)`);
  console.table(
    parts.map(pr => ({
      id: pr.id,
      name: pr.name,
      nomW: pr.nomW,
      nomH: pr.nomH,
      w: pr.w,
      h: pr.h,
      rotate: pr.rotate,
      gaddi: pr.gaddi,
      laminate: pr.laminateCode,
    }))
  );
  console.groupEnd();
  
  return parts;
}
