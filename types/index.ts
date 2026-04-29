import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'agent';
  createdAt: Date;
}

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  propertyInterest: 'House' | 'Plot' | 'Apartment' | 'Commercial' | 'Other';
  budget: number;
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed';
  notes: string;
  assignedTo: Types.ObjectId | null;
  score: 'High' | 'Medium' | 'Low';
  followUpDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivity extends Document {
  leadId: Types.ObjectId;
  action: string;
  performedBy: Types.ObjectId;
  createdAt: Date;
}
