import { useEffect, useState } from "react";

export interface IStatus {
  data?: string;
  error?: string;
  loading?: boolean;
}

export function useStatus(loading: boolean = false) {
  const [status, setStatus] = useState<IStatus>({ loading });
  const setError = (error: string) => setStatus({ error });
  const setData = (data: string) => setStatus({ data });
  const setLoading = () => setStatus({ loading: true });

  return { status, setError, setData, setLoading };
}

export function useQuery(req: () => Promise<any>) {
  const { status, setData, setError } = useStatus(true);

  useEffect(() => {
    req().then(setData).catch(setError);
  }, []);

  return status;
}
