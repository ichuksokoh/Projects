import useSWR from 'swr';
import API from '../services/api';
import React from 'react';

const fetcher = async (req : string) => {
    const response = await API.get(req);
    return response.data;
}

export default function useAPI (req: string) {

    const { data, error, mutate } = useSWR(req, fetcher);
    const [ cachedData, setCachedData ] = React.useState(data);

    React.useEffect(() => {
        if (data !== undefined) {
            setCachedData(data);
        }
    }, [data]);
    
    return {
        data: data || cachedData || null,
        error,
        loading: !data && !error,
        mutate,
    };

};