/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { contracts } from '@/web3/config';
import { useEffect, useState } from 'react';
import {
  useAccount,
  useChainId,
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

const useChainExplorer = (abi: any) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const [transaction, setTransaction] = useState<OpState>({});
  const [prepare, setPrepare] = useState<OpState>({});
  const [args, setArgs] = useState<(string | number | boolean)[]>([]);
  const [functionName, setFunctionName] = useState('');
  const [canWrite, setCanWrite] = useState(args.length > 0);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isSuccess: isPrepareSuccess,
    isLoading: isPrepareLoading,
    data: prepareData,
  } = usePrepareContractWrite({
    address: contracts[chainId === (5 || 80001) ? chainId : 5].factory,
    abi,
    functionName,
    args,
    enabled: canWrite,
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

  const execute = (functionName: string, args: (string | number | boolean)[], valid: boolean) => {
    setFunctionName(functionName);
    setArgs(args);
    setCanWrite(valid);
  };

  return { address, prepare, transaction, execute };
};

export default useChainExplorer;
