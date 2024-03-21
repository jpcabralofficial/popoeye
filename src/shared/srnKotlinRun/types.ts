export enum RunClassName {
  InitializeSettings = 'InitializeSettings',
  UpdateSettings = 'UpdateSettings',
  MerchantLogin = 'MerchantLogin',
  EmployeeLogin = 'EmployeeLogin',
  InitializeSocket = 'InitializeSocket',
  TerminateSocket = 'TerminateSocket',
  GetMemberById = 'GetMemberById',
  GetAllMembers = 'GetAllMembers',
  GetProductsFromParrot = 'GetProductsFromParrot',
  GetProductCategories = 'GetProductCategories',
  GetAllProducts = 'GetAllProducts',
  Print = 'Print',
  InitializeScannerService = 'InitializeScannerService',
  JoinSocketRoom = 'JoinSocketRoom',
  StartPayment = 'StartPayment',
  UpdatePaymentStatus = 'UpdatePaymentStatus',
  CheckPaymentStatus = 'CheckPaymentStatus',
  UpdateOrderPayment = 'UpdateOrderPayment',
  CreateOrder = 'CreateOrder',
  GetOrderByOrderId = 'GetOrderByOrderId',
}

export enum ResultCodes {
  Success = 0,
  Error = -1,
}

export type ParamsType<T extends RunClassName> = ClassTypes[T]['params'];
export type ResultType<T extends RunClassName> = ClassTypes[T]['result'];

type ClassTypes = {
  [RunClassName.InitializeSettings]: {
    params: undefined;
    result: ResultBase<ResponseBase & SettingsList>;
  };

  [RunClassName.UpdateSettings]: {
    params: { settings: [{ key: string; newValue: string }] };
    result: ResultBase<ResponseBase & SettingsList>;
  };

  [RunClassName.MerchantLogin]: {
    params: { username: string; password: string };
    result: ResultBase<
      ResponseBase & {
        data: any;
        merchant_login_details: any;
        shouldGenerateZReading: boolean;
      }
    >;
  };

  [RunClassName.EmployeeLogin]: {
    params: { accessCode: string; shouldUpdateDeviceConfig?: boolean };
    result: ResultBase<ResponseBase & { data: string }>;
  };

  [RunClassName.InitializeSocket]: {
    params: undefined;
    result: ResultBase<ResponseBase>;
  };

  [RunClassName.TerminateSocket]: {
    params: undefined;
    result: ResultBase<ResponseBase>;
  };

  [RunClassName.GetMemberById]: {
    params: { id: any };
    result: ResultBase<
      ResponseBase & {
        data: any;
      }
    >;
  };

  [RunClassName.GetAllMembers]: {
    params: undefined;
    result: ResultBase<ResponseBase>;
  };

  [RunClassName.GetProductsFromParrot]: {
    params: undefined;
    result: ResultBase<ResponseBase & { products: any[]; count: number }>;
  };

  [RunClassName.GetProductCategories]: {
    params: undefined;
    result: ResultBase<ResponseBase & { categories: any[]; count: number }>;
  };

  [RunClassName.GetAllProducts]: {
    params: undefined;
    result: ResultBase<ResponseBase & { products: any[]; count: number }>;
  };

  [RunClassName.Print]: {
    params:
      | {
          action:
            | 'PRINT_POPEYES_KIOSK_QUEUE_TICKET'
            | 'PRINT_CENTRAL_KIOSK_QUEUE_TICKET';
          uuid: string;
          transaction_type?: 'SALE';
          queueParams: {
            number: string;
            where: string;
            date: string;
            items: {
              quantity: number;
              name: string;
            }[];
          };
        }
      | {
          action: 'PRINT_POPEYES_ORDER_RECEIPT';
          transaction_type: 'SALE';
          uuid: string;
          queueNumber: string;
        };

    result: ResultBase<ResponseBase>;
  };

  [RunClassName.InitializeScannerService]: {
    params: undefined;
    result: ResultBase<ResponseBase>;
  };

  [RunClassName.JoinSocketRoom]: {
    params: undefined;
    result: ResultBase<ResponseBase>;
  };

  [RunClassName.StartPayment]: {
    params: {
      transactionType: string;
      industryType: string;
      csNumber: number;
      amount: string;
      tax: number;
      tip: number;
    };
    result: ResultBase<ResponseBase & { transactionId: string }>;
  };

  [RunClassName.UpdatePaymentStatus]: {
    params: {
      transactionId: string;
      status: string;
    };
    result: ResultBase<ResponseBase>;
  };

  [RunClassName.CheckPaymentStatus]: {
    params: {
      transactionId: string;
    };
    result: ResultBase<ResponseBase & { status: string; approvalCode: string }>;
  };

  [RunClassName.UpdateOrderPayment]: {
    params: {
      uuid: string;
      changeFor?: number;
      approvalCode: string;
      modeOfPayment: 'Online Credit Card';
      paymentNetwork?: string;
    };
    result: ResultBase<ResponseBase>;
  };

  [RunClassName.CreateOrder]: {
    params: {
      diningOption: 'Take-out';
      skuList: {
        sku: string;
        quantity: number;
        instructions: string;
        variants?: [];
      }[];
      numberOfPax: number;
      customer?: any; //optional
      tableIds?: []; // optional
    };
    result: ResultBase<ResponseBase & { uuid: string }>;
  };

  [RunClassName.GetOrderByOrderId]: {
    params: {
      uuid: string;
    };
    result: ResultBase<ResponseBase & { data: any }>;
  };
};

type ResponseBase = {
  resultCode: number;
  resultMessage: string;
};

type ResultBase<Response> = {
  isSuccess: boolean;
  errorMessage: string;
  errorCode: number;
  response: Response;
};

type SettingsList = { settings: { [parameters: string]: SettingsType[] } };

export type SettingsType = {
  key: string;
  fieldName: string;
  display: string;
  fieldTypeAndLength: string;
  viewType: 'YES' | 'NO';
  editType: 'S' | 'T' | 'B' | 'C' | 'M';
  rebootIfChanges: '0' | '1';
  description: string;
  defaultValue: string | boolean | number;
  parentName: string;
};

// LANDERS CENTRAL KIOSKS
