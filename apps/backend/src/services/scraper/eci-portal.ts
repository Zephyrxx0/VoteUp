import { chromium, Browser, Page } from 'playwright';

export interface ElectionSchedule {
  state: string;
  electionType: string;
  pdfUrl: string;
  publishedDate: string;
}

const ECI_BASE_URL = 'https://eci.gov.in';
const ECI_SCHEDULE_PATH = '/elections/election-main/';

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }
  return browser;
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

export async function findSchedulePDFs(): Promise<ElectionSchedule[]> {
  const br = await getBrowser();
  const page = await br.newPage();
  const schedules: ElectionSchedule[] = [];
  
  try {
    const targetUrl = `${ECI_BASE_URL}${ECI_SCHEDULE_PATH}`;
    
    await page.goto(targetUrl, { timeout: 30000, waitUntil: 'networkidle' });
    
    const baseSelectors = [
      'a[href*="press"]',
      'a[href*="Press"]', 
      'a[href*=".pdf"]',
      'a[href*="schedule"]',
      'a[href*="Schedule"]',
      'table a',
      '.container a',
      'article a',
    ];
    
    for (const selector of baseSelectors) {
      const links = await page.locator(selector).all();
      
      for (const link of links) {
        try {
          const href = await link.getAttribute('href');
          const text = await link.textContent();
          
          if (href && (href.endsWith('.pdf') || text?.toLowerCase().includes('press'))) {
            const fullUrl = href.startsWith('http') ? href : `${ECI_BASE_URL}${href}`;
            
            if (!schedules.find(s => s.pdfUrl === fullUrl)) {
              schedules.push({
                state: extractState(text || href),
                electionType: 'Press Note',
                pdfUrl: fullUrl,
                publishedDate: new Date().toISOString().split('T')[0],
              });
            }
          }
        } catch {
          continue;
        }
      }
    }
    
    const bodyText = await page.content();
    const pdfMatches = bodyText.match(/https?:\/\/[^\s"')]+\.pdf/g) || [];
    
    for (const url of pdfMatches) {
      if (!schedules.find(s => s.pdfUrl === url)) {
        schedules.push({
          state: 'Unknown',
          electionType: 'Document',
          pdfUrl: url,
          publishedDate: new Date().toISOString().split('T')[0],
        });
      }
    }
  } catch (error) {
    console.error('Error fetching ECI schedule page:', error);
  } finally {
    await page.close();
  }
  
  return schedules;
}

function extractState(text: string): string {
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry',
    'Jammu & Kashmir', 'Ladakh'
  ];
  
  for (const state of indianStates) {
    if (text.toLowerCase().includes(state.toLowerCase())) {
      return state;
    }
  }
  
  return 'Unknown';
}

export async function isECIAvailable(): Promise<boolean> {
  try {
    const br = await getBrowser();
    const page = await br.newPage();
    
    await page.goto(ECI_BASE_URL, { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    const title = await page.title();
    await page.close();
    
    return title.toLowerCase().includes('election') || title.length > 0;
  } catch {
    return false;
  }
}