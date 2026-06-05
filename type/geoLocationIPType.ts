export type geoLocationIPType = {
    ip: string;
    country_code: string;
    country_name: string;
    region_name: string;
    city_name: string;
    latitude: number;
    longitude: number;
    time_zone: string;
    isp: string;
    asn: string;
    fraud_score: number;
    is_proxy: boolean;
    country: {flag: string}
  }