export interface IOtherDocument {
  documentName: string;
  documentNo: string;
  uploadUrl: string;
  description: string;
  issuedDate: string | null;
  expiredDate: string | null;
}

export interface IVendorLicense {
  licenseId: number;
  licenseNo: string;
  uploadUrl: string;
  description: string;
  issuedDate: string | null;
  expiredDate: string | null;
}

export interface IPayloadUpdateLicense {
  vendorLicenses: IVendorLicense[];
  otherDocumentVendor: IOtherDocument[];
  vendorId: number;
  updatedBy: string;
}

export interface IPayloadRequestUpdateLicense {
  request: IPayloadUpdateLicense;
}
