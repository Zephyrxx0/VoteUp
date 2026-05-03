import { findSchedulePDFs, closeBrowser } from '../services/scraper/eci-portal.js';
import { parseECISchedulePDF } from '../services/scraper/pdf-parser.js';
import { upsertConstituencyData } from '../services/db/constituency-store.js';

export interface SyncResult {
  success: boolean;
  processed: number;
  errors: string[];
  startedAt: string;
  completedAt: string;
}

async function scheduledECISync(): Promise<SyncResult> {
  const startedAt = new Date().toISOString();
  const errors: string[] = [];
  let processed = 0;
  
  console.log('[ECI Sync] Starting scheduled sync...');
  
  try {
    // Step 1: Find available PDF schedules
    const pdfs = await findSchedulePDFs();
    console.log(`[ECI Sync] Found ${pdfs.length} PDF schedules`);
    
    // Step 2: Parse each PDF
    for (const pdf of pdfs) {
      try {
        const schedules = await parseECISchedulePDF(pdf.pdfUrl);
        
        if (schedules.length > 0) {
          await upsertConstituencyData(schedules);
          processed += schedules.length;
        }
      } catch (err) {
        const msg = `Failed to parse ${pdf.pdfUrl}: ${err}`;
        console.error(`[ECI Sync] ${msg}`);
        errors.push(msg);
      }
    }
    
    // Cleanup
    await closeBrowser();
    
    const completedAt = new Date().toISOString();
    
    console.log(`[ECI Sync] Complete: ${processed} records processed, ${errors.length} errors`);
    
    return {
      success: errors.length === 0,
      processed,
      errors,
      startedAt,
      completedAt,
    };
  } catch (error) {
    const msg = `Sync failed: ${error}`;
    console.error(`[ECI Sync] ${msg}`);
    errors.push(msg);
    
    await closeBrowser();
    
    return {
      success: false,
      processed,
      errors,
      startedAt,
      completedAt: new Date().toISOString(),
    };
  }
}

// For direct invocation (testing)
async function main() {
  const result = await scheduledECISync();
  console.log('Sync result:', JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { scheduledECISync };