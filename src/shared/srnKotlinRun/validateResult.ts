import { RunClassName, ResultType, ResultCodes } from './types';

const validateSettingsType = (input: any): boolean => {
  if (!('key' in input)) return false;
  if (!('fieldName' in input)) return false;
  if (!('display' in input)) return false;
  if (!('fieldTypeAndLength' in input)) return false;
  if (!('viewType' in input)) return false;
  if (!('editType' in input)) return false;
  if (!('description' in input)) return false;
  if (!('rebootIfChanged' in input)) return false;
  if (!('defaultValue' in input)) return false;
  if (!('parentName' in input)) return false;

  if (typeof input.key !== 'string') return false;
  if (typeof input.fieldName !== 'string') return false;
  if (typeof input.display !== 'string') return false;
  if (typeof input.fieldTypeAndLength !== 'string') return false;
  if (typeof input.viewType !== 'string') return false;
  if (typeof input.editType !== 'string') return false;
  if (typeof input.description !== 'string') return false;
  if (typeof input.rebootIfChanged !== 'string') return false;
  if (typeof input.parentName !== 'string') return false;

  if (!(input.viewType === 'NO' || input.viewType === 'YES')) {
    return false;
  }

  if (
    !(
      input.editType === 'S' ||
      input.editType === 'T' ||
      input.editType === 'B' ||
      input.editType === 'C' ||
      input.editType === 'M'
    )
  ) {
    return false;
  }

  if (!(input.rebootIfChanged === '0' || input.rebootIfChanged === '1')) {
    return false;
  }

  return true;
};

const validateSettingsList = (input: any): boolean => {
  if (!('settings' in input)) return false;

  if (
    !Object.values(input.settings).every(p => {
      if (!Array.isArray(p)) return false;
      if (!p.every(v => validateSettingsType(v))) return false;

      return true;
    })
  ) {
    return false;
  }

  return true;
};

export const validateResult = <ClassName extends RunClassName>(
  className: ClassName,
  result: ResultType<ClassName>,
): boolean => {
  const { response } = result;

  if (
    !('response' in result) ||
    !('resultCode' in response) ||
    !('resultMessage' in response) ||
    !(typeof response.resultCode === 'number') ||
    !(typeof response.resultMessage === 'string')
  ) {
    return false;
  }

  switch (className) {
    case RunClassName.InitializeSocket:
    case RunClassName.TerminateSocket:
      return true;
    case RunClassName.InitializeSettings:
      if (response.resultCode !== ResultCodes.Success) return true;

      if (!validateSettingsList(response)) {
        return false;
      }
      return true;
    case RunClassName.UpdateSettings:
      return true;
    case RunClassName.MerchantLogin:
      if (response.resultCode !== ResultCodes.Success) return true;

      if (!('data' in response)) {
        return false;
      }

      return true;

    case RunClassName.EmployeeLogin:
      if (response.resultCode !== ResultCodes.Success) return true;

      if (!('data' in response) || !(typeof response.data === 'string')) {
        return false;
      }

      return true;
    case RunClassName.GetMemberById:
      if (response.resultCode !== ResultCodes.Success) return true;

      if (!('data' in response)) {
        return false;
      }

      return true;
    case RunClassName.GetAllMembers:
      return true;
    case RunClassName.GetProductsFromParrot:
      return true;
    case RunClassName.GetProductCategories:
      if (response.resultCode !== ResultCodes.Success) return true;
      /* TODO: Implement product categories validation */
      return true;
    case RunClassName.GetAllProducts:
      if (response.resultCode !== ResultCodes.Success) return true;
      /* TODO: Implement product list validation */
      return true;
    case RunClassName.Print:
      return true;
    case RunClassName.InitializeScannerService:
      return true;
    case RunClassName.JoinSocketRoom:
    case RunClassName.StartPayment:
    case RunClassName.UpdatePaymentStatus:
    case RunClassName.CheckPaymentStatus:
    case RunClassName.CreateOrder:
      return true;
    default:
      throw new Error(`Unhandled result validation: ${className}`);
  }
};
