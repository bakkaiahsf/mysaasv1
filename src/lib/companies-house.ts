export interface CompanySearchResult {
  company_number: string;
  title: string;
  company_status: string;
  company_type: string;
  date_of_creation?: string;
  address?: {
    address_line_1?: string;
    address_line_2?: string;
    locality?: string;
    postal_code?: string;
    country?: string;
  };
  address_snippet?: string;
  description?: string;
  kind?: string;
  links?: {
    self?: string;
  };
}

export interface CompanyProfile {
  company_number: string;
  company_name: string;
  company_status: string;
  company_type: string;
  date_of_creation: string;
  date_of_cessation?: string;
  registered_office_address: {
    address_line_1?: string;
    address_line_2?: string;
    locality?: string;
    postal_code?: string;
    country?: string;
  };
  sic_codes?: string[];
  has_been_liquidated?: boolean;
  has_charges?: boolean;
  has_insolvency_history?: boolean;
  accounts?: {
    next_due?: string;
    last_accounts?: {
      made_up_to?: string;
      type?: string;
    };
  };
  confirmation_statement?: {
    next_due?: string;
    last_made?: string;
  };
  links?: {
    self?: string;
    filing_history?: string;
    officers?: string;
    charges?: string;
  };
}

export interface SearchResponse {
  items: CompanySearchResult[];
  items_per_page: number;
  kind: string;
  start_index: number;
  total_results: number;
}

export class CompaniesHouseAPI {
  private baseUrl = 'https://api.company-information.service.gov.uk';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.COMPANIES_HOUSE_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('COMPANIES_HOUSE_API_KEY environment variable is required');
    }
  }

  private async makeRequest(endpoint: string): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Companies House API error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Companies House API request failed:', error);
      throw error;
    }
  }

  async searchCompanies(query: string, itemsPerPage: number = 20): Promise<SearchResponse> {
    const encodedQuery = encodeURIComponent(query);
    const endpoint = `/search/companies?q=${encodedQuery}&items_per_page=${itemsPerPage}`;
    return this.makeRequest(endpoint);
  }

  async getCompanyProfile(companyNumber: string): Promise<CompanyProfile> {
    const endpoint = `/company/${companyNumber}`;
    return this.makeRequest(endpoint);
  }

  async getCompanyOfficers(companyNumber: string, itemsPerPage: number = 35) {
    const endpoint = `/company/${companyNumber}/officers?items_per_page=${itemsPerPage}`;
    return this.makeRequest(endpoint);
  }

  async getCompanyFilingHistory(companyNumber: string, itemsPerPage: number = 25) {
    const endpoint = `/company/${companyNumber}/filing-history?items_per_page=${itemsPerPage}`;
    return this.makeRequest(endpoint);
  }

  async getCompanyPSCs(companyNumber: string, itemsPerPage: number = 35) {
    const endpoint = `/company/${companyNumber}/persons-with-significant-control?items_per_page=${itemsPerPage}`;
    return this.makeRequest(endpoint);
  }
}

export const companiesHouseAPI = new CompaniesHouseAPI();