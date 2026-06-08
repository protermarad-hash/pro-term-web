export interface CourierConfig {
  provider: 'fan-courier' | 'sameday' | 'cargus' | 'dpd';
  apiUrl: string;
  username: string;
  password: string;
  clientId: string;
}

export interface AWBRequest {
  recipient: {
    name: string;
    phone: string;
    address: string;
    city: string;
    county: string;
  };
  packages: {
    weight: number;
    length?: number;
    width?: number;
    height?: number;
  }[];
  paymentType: 'sender' | 'recipient';
  declaredValue?: number;
  notes?: string;
}

export interface AWBResponse {
  awbNumber: string;
  trackingUrl: string;
  estimatedDelivery: string;
  price: number;
}

export async function generateAWB(
  _config: CourierConfig,
  _request: AWBRequest
): Promise<AWBResponse> {
  throw new Error('În curs de implementare — credențiale API necesare');
}

export async function trackShipment(
  _config: CourierConfig,
  _awbNumber: string
): Promise<{ status: string; events: { date: string; description: string }[] }> {
  throw new Error('În curs de implementare — credențiale API necesare');
}

export async function cancelAWB(
  _config: CourierConfig,
  _awbNumber: string
): Promise<{ success: boolean }> {
  throw new Error('În curs de implementare — credențiale API necesare');
}
