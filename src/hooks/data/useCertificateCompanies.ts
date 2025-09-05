import { useState, useEffect } from 'react';
import { certificateCompanyService, CertificateCompany } from '@/services/certificateCompanyService';
import { getCookie } from '@/lib/cookie-utils';

export interface CertificateCompanyOption {
  value: string;
  label: string;
}

export const useCertificateCompanies = () => {
  const [companies, setCompanies] = useState<CertificateCompany[]>([]);
  const [options, setOptions] = useState<CertificateCompanyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificateCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from localStorage
      const token = getCookie('token')
      
      const response = await certificateCompanyService.getCertificateCompanies({ limit: 100 }, token || undefined);
      
      if (response.success && response.data) {
        const companiesData = response.data.data;
        setCompanies(companiesData);
        
        // Convert to dropdown options
        const dropdownOptions = certificateCompanyService.formatForDropdown(companiesData);
        setOptions(dropdownOptions);
      } else {
        throw new Error(response.message || 'Failed to fetch certificate companies');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch certificate companies';
      setError(errorMessage);
      console.error('Error fetching certificate companies:', err);
      
      // Fallback to static data if API fails
      const fallbackOptions = [
        { value: '1', label: 'GIA' },
        { value: '2', label: 'IGI' },
        { value: '3', label: 'AGS' },
        { value: '4', label: 'HRD' },
        { value: '5', label: 'Other' },
      ];
      setOptions(fallbackOptions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificateCompanies();
  }, []);

  // Helper function to get company name by ID
  const getCompanyNameById = (id: string | number): string => {
    const company = companies.find(c => c.id.toString() === id.toString());
    return company?.name || '';
  };

  return {
    companies,
    options,
    loading,
    error,
    refetch: fetchCertificateCompanies,
    getCompanyNameById
  };
};