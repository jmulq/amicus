/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { isStringArray } from '@/utils';
import { contracts } from '@/web3/config';
import { useEffect, useState } from 'react';
import {
  useAccount,
  useChainId,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

type OpState = {
  isLoading?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  error?: Error | null;
  data?: any;
};

const useChainExplorer = ({ abi, contract }: { abi: any; contract?: `0x${string}` }) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const [transaction, setTransaction] = useState<OpState>({});
  const [prepare, setPrepare] = useState<OpState>({});
  const [args, setArgs] = useState<(string | number | boolean)[]>([]);
  const [functionName, setFunctionName] = useState('');
  const [value, setValue] = useState<bigint | undefined>();
  const [canWrite, setCanWrite] = useState(args.length > 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isSuccess: isPrepareSuccess,
    isLoading: isPrepareLoading,
    data: prepareData,
  } = usePrepareContractWrite({
    address: contract ?? contracts[chainId === (5 || 80001) ? chainId : 5].factory,
    abi,
    functionName,
    args,
    enabled: canWrite,
    value,
  });

  // Watch for changes in the prepare state
  useEffect(() => {
    setCanWrite(isPrepareSuccess);

    setPrepare((prev) => ({
      ...prev,
      isLoading: isPrepareLoading,
      error: prepareError,
      isError: isPrepareError,
      isSuccess: isPrepareSuccess,
      data: prepareData,
    }));
  }, [prepareError, isPrepareError, isPrepareSuccess, isPrepareLoading, prepareData]);

  const { data, write } = useContractWrite(config);

  const {
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
    isError: isTxError,
    error: txError,
    data: txData,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  // Watch for changes in the transaction state
  useEffect(() => {
    setTransaction((prev) => ({
      ...prev,
      isLoading: isTxLoading,
      isSuccess: isTxSuccess,
      isError: isTxError,
      error: txError,
      data: txData,
    }));
  }, [data, isTxLoading, isTxSuccess, isTxError, txError, txData]);

  // Write to the blockchain if initial validations pass
  useEffect(() => {
    if (canWrite) {
      write?.();
    }
  }, [canWrite, write]);

  useEffect(() => {
    if (isPrepareLoading) {
      setIsLoading(true);
      return;
    }

    if (isTxSuccess) {
      setIsLoading(false);
      return;
    }
  }, [isPrepareLoading, isTxSuccess]);

  useEffect(() => {
    if (isTxSuccess) {
      setSuccess(true);
    }
  }, [isTxSuccess]);

  useEffect(() => {
    if (prepareError || txError) {
      setError(prepareError ?? txError);
    }
  }, [prepareError, txError]);

  const writeFn = (functionName: string, args: (string | number | boolean)[], valid: boolean, value?: bigint) => {
    setFunctionName(functionName);
    setArgs(args);
    setValue(value);
    setCanWrite(valid);
  };

  /**
   *
   * @param input  - array of function names or array of objects with address, abi, and functionName
   * @param enabled - boolean to enable or disable hook
   * @param address - (optional) address of contract
   * @param abi - (optional) abi of contract
   * @example
   * const {data} = readFn(['name', 'image'], true)
   * @description - will default the address and abi to the contract and abi passed into the hook if not provided
   */
  const readFn = (
    input: string[] | { address: `0x${string}`; abi: any; functionName: string }[],
    enabled: boolean,
    address: `0x${string}` | undefined = contract,
  ) => {
    const args = [] as { address: `0x${string}`; abi: any; functionName: string }[];

    if (isStringArray(input)) {
      if (!abi || !address) throw new Error('Must provide abi and address');

      input.forEach((fn) => {
        args.push({
          address,
          abi: abi as any,
          functionName: fn as string,
        });
      });
    } else {
      // check to make sure all items in input are objects with address, abi, and functionName
      input.forEach((fn) => {
        const arg = fn as { address: `0x${string}`; abi: any; functionName: string };
        if (!arg.address || !arg.abi || !arg.functionName)
          throw new Error('Must provide address, abi, and functionName');
      });
    }

    const { data,  } = useContractReads({
      contracts: args,
      enabled
    });
    
    return data?.map((d) => d.result) as any[];
  };

  return { address, error, isLoading, isSuccess, prepare, transaction, writeFn, readFn };
};

export default useChainExplorer;
