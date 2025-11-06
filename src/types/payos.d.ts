export interface PayOSConfig {
  RETURN_URL: string;
  ELEMENT_ID: string;
  CHECKOUT_URL: string | null;
  embedded: boolean;
  onSuccess: (event?: any) => void;
  onCancel?: (event?: any) => void;
}
