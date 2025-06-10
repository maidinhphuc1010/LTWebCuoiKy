declare module Device {
  export interface Info {
    id: string; // Đổi từ number → string để khớp với MongoDB _id
    name: string;
    type: string;
    quantity: number;
    department: string;
    description?: string;
  }
}
