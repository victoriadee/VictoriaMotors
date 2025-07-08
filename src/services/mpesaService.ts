import axios from 'axios';
import { MpesaPaymentRequest, MpesaPaymentResponse, PaymentStatus } from '../types/payment';

class MpesaService {
  private baseURL: string;
  private consumerKey: string;
  private consumerSecret: string;
  private passkey: string;
  private shortcode: string;

  constructor() {
    // In production, these should come from environment variables
    this.baseURL = import.meta.env.VITE_MPESA_BASE_URL || 'https://sandbox.safaricom.co.ke';
    this.consumerKey = import.meta.env.VITE_MPESA_CONSUMER_KEY || 'demo_consumer_key';
    this.consumerSecret = import.meta.env.VITE_MPESA_CONSUMER_SECRET || 'demo_consumer_secret';
    this.passkey = import.meta.env.VITE_MPESA_PASSKEY || 'demo_passkey';
    this.shortcode = import.meta.env.VITE_MPESA_SHORTCODE || '174379';
  }

  private async getAccessToken(): Promise<string> {
    try {
      const auth = btoa(`${this.consumerKey}:${this.consumerSecret}`);
      const response = await axios.get(`${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  private generatePassword(): string {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = btoa(`${this.shortcode}${this.passkey}${timestamp}`);
    return password;
  }

  private getTimestamp(): string {
    return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  }

  async initiateSTKPush(paymentRequest: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword();

      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: paymentRequest.amount,
        PartyA: paymentRequest.phoneNumber,
        PartyB: this.shortcode,
        PhoneNumber: paymentRequest.phoneNumber,
        CallBackURL: `${window.location.origin}/api/mpesa/callback`,
        AccountReference: paymentRequest.accountReference,
        TransactionDesc: paymentRequest.transactionDesc,
      };

      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpush/v1/processrequest`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error initiating STK push:', error);
      throw new Error('Failed to initiate M-Pesa payment');
    }
  }

  async queryPaymentStatus(checkoutRequestID: string): Promise<PaymentStatus> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword();

      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID,
      };

      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpushquery/v1/query`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error querying payment status:', error);
      throw new Error('Failed to query payment status');
    }
  }

  // Demo method for development - simulates successful payment
  async simulatePayment(paymentRequest: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      merchantRequestID: `demo_merchant_${Date.now()}`,
      checkoutRequestID: `demo_checkout_${Date.now()}`,
      responseCode: '0',
      responseDescription: 'Success. Request accepted for processing',
      customerMessage: 'Success. Request accepted for processing',
    };
  }

  // Demo method for development - simulates payment status check
  async simulatePaymentStatus(checkoutRequestID: string): Promise<PaymentStatus> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      resultCode: '0',
      resultDesc: 'The service request is processed successfully.',
      merchantRequestID: `demo_merchant_${Date.now()}`,
      checkoutRequestID: checkoutRequestID,
      amount: 100,
      mpesaReceiptNumber: `MPE${Date.now()}`,
      transactionDate: new Date().toISOString(),
      phoneNumber: '254712345678',
    };
  }
}

export const mpesaService = new MpesaService();