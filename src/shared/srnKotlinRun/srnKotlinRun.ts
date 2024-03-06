import { run } from 'serino-pos-kotlin-bridge';

import { RunClassName, ParamsType, ResultType } from './types';

import { validateResult } from './validateResult';

const silentClassNames = [
  RunClassName.InitializeSettings,
  RunClassName.MerchantLogin,
  RunClassName.EmployeeLogin,
  RunClassName.GetMemberById,
  RunClassName.GetProductsFromParrot,
];

const replacer = (key: string, value: any) => {
  switch (key) {
    case 'cardNumber':
      return value.slice(0, -4).replace(/./g, 'X') + value.slice(-4);
    case 'digitalSignatureBase64String':
    case 'ReceiptBase64EncodedString':
      return `[base64 data (${value.length} bytes)]`;
    default:
      return value;
  }
};

export const srnKotlinRun = async <ClassName extends RunClassName>(
  className: ClassName,
  params: ParamsType<ClassName>,
): Promise<ResultType<ClassName>> => {
  const requestStartedAt = new Date().getTime();
  try {
    console.debug(
      `Run request ${className}(${JSON.stringify(params, replacer)})`,
    );

    const props = { className, params };
    const resultString = await run(JSON.stringify(props));
    console.log(
      `Execution time for: ${className} - ${
        new Date().getTime() - requestStartedAt
      } ms`,
    );

    const result = JSON.parse(resultString);
    if (result.response) {
      result.response = JSON.parse(result.response);
    }

    if (!validateResult(className, result)) {
      throw new Error(`Invalid ${className} result: ${JSON.stringify(result)}`);
    }

    if (!silentClassNames.includes(className)) {
      console.debug(
        `Run ${className} result: ${JSON.stringify(result, replacer)}`,
      );
    }

    return result;
  } catch (error: any) {
    console.warn(
      `Execution time for: ${className} - ${
        new Date().getTime() - requestStartedAt
      } ms`,
    );
    throw error;
  }
};
