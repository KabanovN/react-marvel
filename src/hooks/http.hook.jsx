import { useState, useCallback } from 'react';

//кастомный хук для запросов с логикой loading, error
function useHttp() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(
        async (
            url,
            method = 'GET',
            body = null,
            headers = { 'Content-Type': 'Application/json' }
        ) => {
            setLoading(true);
            try {
                const res = await fetch(url, { method, body, headers });

                if (!res.ok) {
                    throw new Error(`status: ${res.status}`);
                }

                const data = await res.json();
                setLoading(false);
                return data;
            } catch (error) {
                setLoading(false);
                setError(error.message);
                throw error;
            }
        },
        []
    );

    //очистка ошибок для возможности повторного запроса
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    //возвращаем из хука сущности
    return { loading, request, error, clearError };
}

export default useHttp;
